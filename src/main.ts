import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_name: string;
  source_icon: string | null;
  category: string[];
  country: string[];
  language: string;
}

const API_KEY = (import.meta as any).env?.VITE_NEWSDATA_API_KEY || '';
const BASE_URL = 'https://newsdata.io/api/1/latest';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=60';

class WorldTopNewsApp {
  private currentCategory = 'top';
  private currentCountry = 'in';
  private currentLanguage = 'en';
  private currentTab = 'feed';
  private searchQuery = '';
  private nextPageCursor: string | null = null;
  private articles: NewsArticle[] = [];
  private bookmarkedArticles: NewsArticle[] = [];
  private isLoading = false;
  private deferredPrompt: any = null;

  constructor() {
    this.init();
  }

  private async init() {
    this.registerServiceWorker();
    this.setupPWAInstall();
    this.setupNetworkListeners();
    await this.loadBookmarks();
    this.setupEventListeners();
    await this.fetchNews(true);
  }

  private registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('[PWA SW] ServiceWorker registered with scope:', reg.scope);
        }).catch((err) => {
          console.warn('[PWA SW] ServiceWorker registration failed:', err);
        });
      });
    }
  }

  private setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBanner = document.getElementById('pwa-install-banner');
      if (installBanner) installBanner.style.display = 'flex';
    });

    document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const choice = await this.deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[PWA] User installed application');
        }
        this.deferredPrompt = null;
        const installBanner = document.getElementById('pwa-install-banner');
        if (installBanner) installBanner.style.display = 'none';
      }
    });
  }

  private setupNetworkListeners() {
    const banner = document.getElementById('offline-banner');
    const updateOnlineStatus = () => {
      if (banner) {
        banner.style.display = navigator.onLine ? 'none' : 'flex';
      }
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  private setupEventListeners() {
    // Category chips
    const chipContainer = document.getElementById('category-chips');
    if (chipContainer) {
      // Set default top chip as active
      const topChip = chipContainer.querySelector('[data-cat="top"]');
      if (topChip) topChip.removeAttribute('outline');

      chipContainer.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('ion-chip') as any;
        if (target && target.dataset?.cat) {
          const cat = target.dataset.cat;
          if (cat !== this.currentCategory) {
            this.setCategory(cat);
          }
        }
      });
    }

    // Search Toggle & Live Search Bar
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchWrapper = document.getElementById('search-bar-wrapper');
    const searchBar = document.getElementById('news-searchbar') as any;

    if (searchToggle && searchWrapper) {
      searchToggle.addEventListener('click', () => {
        const isVisible = searchWrapper.style.display !== 'none';
        searchWrapper.style.display = isVisible ? 'none' : 'block';
        if (!isVisible && searchBar) {
          setTimeout(() => searchBar.setFocus(), 150);
        }
      });
    }

    if (searchBar) {
      searchBar.addEventListener('ionInput', (e: any) => {
        this.searchQuery = (e.target.value || '').toLowerCase().trim();
        this.renderArticles();
      });
    }

    // Profile / Options Button in Top Header
    document.getElementById('profile-btn')?.addEventListener('click', () => this.showProfileModal());

    // Country selector
    document.getElementById('country-btn')?.addEventListener('click', () => this.showCountryPicker());

    // Language selector
    document.getElementById('lang-btn')?.addEventListener('click', () => this.showLanguagePicker());

    // Refresher
    const refresher = document.getElementById('refresher') as any;
    if (refresher) {
      refresher.addEventListener('ionRefresh', async (event: any) => {
        await this.fetchNews(true);
        event.target.complete();
      });
    }

    // Load more
    document.getElementById('load-more-btn')?.addEventListener('click', () => this.fetchNews(false));

    // Retry button
    document.getElementById('retry-btn')?.addEventListener('click', () => this.fetchNews(true));

    // Tab buttons matching original Ionic navigation
    document.getElementById('tab-feed')?.addEventListener('click', () => this.switchTab('feed'));
    document.getElementById('tab-categories')?.addEventListener('click', () => this.switchTab('categories'));
    document.getElementById('tab-bookmarks')?.addEventListener('click', () => this.switchTab('bookmarks'));
    document.getElementById('tab-about')?.addEventListener('click', () => this.switchTab('about'));
  }

  private switchTab(tab: string) {
    this.currentTab = tab;
    const catBar = document.getElementById('category-toolbar');
    const loadMoreContainer = document.getElementById('load-more-container');

    // Update tab bar selections
    ['feed', 'categories', 'bookmarks', 'about'].forEach(t => {
      const btn = document.getElementById(`tab-${t}`);
      if (t === tab) {
        btn?.classList.add('tab-selected');
        btn?.setAttribute('selected', 'true');
      } else {
        btn?.classList.remove('tab-selected');
        btn?.removeAttribute('selected');
      }
    });

    if (tab === 'feed') {
      if (catBar) catBar.style.display = 'block';
      this.renderArticles();
      if (loadMoreContainer) {
        loadMoreContainer.style.display = this.nextPageCursor ? 'block' : 'none';
      }
    } else if (tab === 'categories') {
      if (catBar) catBar.style.display = 'block';
      this.showCategoryPicker();
    } else if (tab === 'bookmarks') {
      if (catBar) catBar.style.display = 'none';
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      this.renderBookmarks();
    } else if (tab === 'about') {
      if (catBar) catBar.style.display = 'none';
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      this.renderAboutAndPolicy();
    }
  }

  private async fetchNews(reset = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    const skeletonLoader = document.getElementById('skeleton-loader');
    const articlesContainer = document.getElementById('articles-container');
    const emptyState = document.getElementById('empty-state');
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn') as any;
    const loadMoreText = document.getElementById('load-more-text');
    const loadMoreIcon = document.getElementById('load-more-icon');
    const cacheBanner = document.getElementById('cache-notice-banner');

    if (reset) {
      this.articles = [];
      this.nextPageCursor = null;
      if (articlesContainer) articlesContainer.style.display = 'none';
      if (skeletonLoader) skeletonLoader.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      if (cacheBanner) cacheBanner.style.display = 'none';
    } else {
      // Pagination loader state
      if (loadMoreText) loadMoreText.textContent = 'Fetching bulletins...';
      if (loadMoreIcon) loadMoreIcon.setAttribute('name', 'reload-outline');
      if (loadMoreBtn) loadMoreBtn.disabled = true;
    }

    let fetchSuccess = false;

    try {
      const url = new URL(BASE_URL);
      url.searchParams.set('apikey', API_KEY);
      url.searchParams.set('language', this.currentLanguage);

      if (this.currentCountry !== 'all') {
        url.searchParams.set('country', this.currentCountry);
      }
      if (this.currentCategory !== 'top') {
        url.searchParams.set('category', this.currentCategory);
      }
      if (!reset && this.nextPageCursor) {
        url.searchParams.set('page', this.nextPageCursor);
      }

      // 10 second timeout for slow connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
        const validArticles: NewsArticle[] = data.results.map((r: any) => ({
          article_id: r.article_id || Math.random().toString(36).substring(2),
          title: r.title || 'Breaking Headline',
          description: r.description || null,
          link: r.link || '#',
          image_url: r.image_url || null,
          pubDate: r.pubDate || new Date().toISOString(),
          source_name: r.source_name || 'World News',
          source_icon: r.source_icon || null,
          category: r.category || [],
          country: r.country || [],
          language: r.language || 'english'
        }));

        if (reset) {
          this.articles = validArticles;
        } else {
          this.articles.push(...validArticles);
        }

        this.nextPageCursor = data.nextPage || null;
        fetchSuccess = true;

        // Save last successful response to local storage cache
        await this.saveLastNewsCache(this.articles);
        if (cacheBanner) cacheBanner.style.display = 'none';
      }
    } catch (err) {
      console.warn('Network or API fetch error, attempting cache fallback:', err);
    } finally {
      this.isLoading = false;

      // Restore Load More button
      if (loadMoreText) loadMoreText.textContent = 'Load More Bulletins';
      if (loadMoreIcon) loadMoreIcon.setAttribute('name', 'arrow-down-circle-outline');
      if (loadMoreBtn) loadMoreBtn.disabled = false;

      // Fallback to cached articles if fetch failed or returned zero items
      if (reset && !fetchSuccess && this.articles.length === 0) {
        const cachedArticles = await this.loadLastNewsCache();
        if (cachedArticles && cachedArticles.length > 0) {
          this.articles = cachedArticles;
          if (cacheBanner) cacheBanner.style.display = 'flex';
        }
      }

      if (skeletonLoader) skeletonLoader.style.display = 'none';
      if (articlesContainer) articlesContainer.style.display = 'grid';

      if (this.currentTab === 'feed') {
        this.renderArticles();
        if (loadMoreContainer) {
          loadMoreContainer.style.display = this.nextPageCursor ? 'block' : 'none';
        }
      }
    }
  }

  private async saveLastNewsCache(articles: NewsArticle[]) {
    if (!articles || articles.length === 0) return;
    try {
      const payload = JSON.stringify({ timestamp: Date.now(), articles });
      await Preferences.set({ key: 'wtn_last_news_cache', value: payload });
    } catch {
      localStorage.setItem('wtn_last_news_cache', JSON.stringify({ timestamp: Date.now(), articles }));
    }
  }

  private async loadLastNewsCache(): Promise<NewsArticle[] | null> {
    try {
      const { value } = await Preferences.get({ key: 'wtn_last_news_cache' });
      if (value) {
        const parsed = JSON.parse(value);
        return parsed.articles || null;
      }
    } catch {
      const local = localStorage.getItem('wtn_last_news_cache');
      if (local) {
        const parsed = JSON.parse(local);
        return parsed.articles || null;
      }
    }
    return null;
  }

  private renderArticles() {
    const container = document.getElementById('articles-container');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;

    let filtered = this.articles;
    if (this.searchQuery) {
      filtered = this.articles.filter(a =>
        a.title.toLowerCase().includes(this.searchQuery) ||
        (a.description && a.description.toLowerCase().includes(this.searchQuery)) ||
        a.source_name.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map((article, idx) => this.generateCardHTML(article, idx, false)).join('');
    this.attachCardEventListeners(container, filtered);
  }

  private renderBookmarks() {
    const container = document.getElementById('articles-container');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;

    if (this.bookmarkedArticles.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 64px 24px;">
          <ion-icon name="star-outline" style="font-size: 72px; color: #94a3b8;"></ion-icon>
          <h3 style="margin-top: 16px; font-weight: 700;">No Saved Favorites</h3>
          <p style="color: var(--text-sub); font-size: 14px; max-width: 320px; margin: 8px auto;">
            Tap the star icon on any bulletin to save stories for offline reading.
          </p>
        </div>
      `;
      if (emptyState) emptyState.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = this.bookmarkedArticles.map((article, idx) => this.generateCardHTML(article, idx, true)).join('');
    this.attachCardEventListeners(container, this.bookmarkedArticles);
  }

  private renderAboutAndPolicy() {
    const container = document.getElementById('articles-container');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;
    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 12px; max-width: 720px; margin: 0 auto; width: 100%;">
        <div style="text-align: center; padding: 24px 16px;">
          <img src="/resources/icon.png" style="width: 80px; height: 80px; margin-bottom: 12px; border-radius: 16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));" alt="Logo" onerror="this.style.display='none'" />
          <h2 style="font-weight: 800; margin: 8px 0 4px 0; font-size: 24px;">World Top News</h2>
          <ion-badge color="primary" style="font-size: 12px; padding: 6px 12px;">PWA v2.0.0 | Offline Ready</ion-badge>
          <p style="color: var(--text-sub); font-size: 14px; margin-top: 12px; line-height: 1.5;">
            Crafted with ❤️ by <b>Tech Monk-Kapil from India 🇮🇳</b><br/>
            Real-time live news, sports, tech, and financial headlines from top global publishers.
          </p>
        </div>

        <ion-list inset="true">
          <ion-item button id="link-playstore" detail="true">
            <ion-icon slot="start" name="logo-google-playstore" color="success" style="font-size: 24px;"></ion-icon>
            <ion-label>
              <h3 style="font-weight: 700;">Google Play Store App</h3>
              <p>raghuwanshi.kapil.WorldTopNews</p>
            </ion-label>
          </ion-item>

          <ion-item button id="link-pwa" detail="true">
            <ion-icon slot="start" name="globe-outline" color="primary" style="font-size: 24px;"></ion-icon>
            <ion-label>
              <h3 style="font-weight: 700;">Official PWA Web App</h3>
              <p>worldtopnews-91916.firebaseapp.com</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <div class="policy-box">
          <h3 style="font-weight: 700; display: flex; align-items: center; gap: 8px; margin-top: 0;">
            <ion-icon name="newspaper-outline" color="primary" style="font-size: 22px;"></ion-icon>
            Google Play News Policy & Ownership Disclosure
          </h3>
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-sub);">
            <b>World Top News</b> is a curated live global news aggregation service. All headlines, article descriptions, and metadata are aggregated live via accredited international publisher syndication feeds and <b>NewsData.io API</b>.
          </p>
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-sub);">
            <b>Editorial & Content Sourcing Policy:</b>
            World Top News does not claim copyright ownership over third-party publisher content. When readers tap "Read Story", full articles safely open directly on the publisher's official secure website in a sandboxed browser frame.
          </p>
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-sub);">
            <b>Publisher Inquiries, Copyright & Corrections:</b><br/>
            Developer & Publisher: <b>Tech Monk - Kapil</b><br/>
            Editorial Contact Email: <a href="mailto:raghuwanshi.kapil@gmail.com" style="color: var(--ion-color-primary); font-weight: 600;">raghuwanshi.kapil@gmail.com</a>
          </p>
        </div>

        <div class="policy-box">
          <h3 style="font-weight: 700; display: flex; align-items: center; gap: 8px; margin-top: 0;">
            <ion-icon name="shield-checkmark-outline" color="primary" style="font-size: 22px;"></ion-icon>
            Privacy Policy & Data Safety
          </h3>
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-sub);">
            World Top News does not collect, transmit, or monetize personal user data, contacts, or location records.
            All bookmarks and user preferences remain 100% stored on-device in secure local storage.
          </p>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
            Target API Level: 35 (Android 15) | Complies with Google Play Developer Program & News Policies.
          </p>
        </div>
      </div>
    `;

    document.getElementById('link-playstore')?.addEventListener('click', () => {
      this.openBrowser('https://play.google.com/store/apps/details?id=raghuwanshi.kapil.WorldTopNews');
    });

    document.getElementById('link-pwa')?.addEventListener('click', () => {
      this.openBrowser('https://worldtopnews-91916.firebaseapp.com');
    });
  }

  private generateCardHTML(article: NewsArticle, idx: number, isBookmarkTab: boolean): string {
    const isBookmarked = this.bookmarkedArticles.some(b => b.article_id === article.article_id);
    const timeFormatted = this.formatRelativeTime(article.pubDate);
    const imageUrl = article.image_url || FALLBACK_IMAGE;
    const isHero = idx === 0 && !isBookmarkTab && !this.searchQuery;

    return `
      <div class="news-card ${isHero ? 'hero-card' : ''}" data-idx="${idx}">
        <div class="news-card-img-wrapper">
          <img src="${imageUrl}" alt="${article.title}" class="news-card-img" loading="lazy" onerror="this.src='${FALLBACK_IMAGE}'" />
          <div class="news-source-tag">
            ${article.source_icon ? `<img src="${article.source_icon}" class="news-source-icon" onerror="this.style.display='none'"/>` : ''}
            <span>${article.source_name}</span>
          </div>
          <div class="news-time-tag">${timeFormatted}</div>
        </div>
        <div class="news-card-body">
          <div>
            <h2 class="news-title">${article.title}</h2>
            ${article.description ? `<p class="news-desc">${article.description.substring(0, 160)}...</p>` : ''}
          </div>
          <div class="card-actions">
            <ion-button fill="clear" size="small" color="primary" class="btn-read-more" data-idx="${idx}">
              Read Story
              <ion-icon slot="end" name="open-outline"></ion-icon>
            </ion-button>
            <div>
              <ion-button fill="clear" size="small" color="medium" class="btn-share" data-idx="${idx}">
                <ion-icon slot="icon-only" name="share-social-outline"></ion-icon>
              </ion-button>
              <ion-button fill="clear" size="small" color="${isBookmarked ? 'primary' : 'medium'}" class="btn-bookmark" data-idx="${idx}">
                <ion-icon slot="icon-only" name="${isBookmarked ? 'star' : 'star-outline'}"></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachCardEventListeners(container: HTMLElement, articleList: NewsArticle[]) {
    // Read More
    container.querySelectorAll('.btn-read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
        const article = articleList[idx];
        if (article && article.link) {
          this.openBrowser(article.link);
        }
      });
    });

    // Share
    container.querySelectorAll('.btn-share').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
        const article = articleList[idx];
        if (article) {
          await this.shareArticle(article);
        }
      });
    });

    // Bookmark / Star Favorite
    container.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
        const article = articleList[idx];
        if (article) {
          await this.toggleBookmark(article);
          if (this.currentTab === 'bookmarks') {
            this.renderBookmarks();
          } else {
            this.renderArticles();
          }
        }
      });
    });
  }

  private async openBrowser(url: string) {
    try {
      await Browser.open({ url });
    } catch {
      window.open(url, '_blank');
    }
  }

  private async shareArticle(article: NewsArticle) {
    const shareFooter = 'Shared using World Top News crafted by Tech Monk-Kapil';
    const shareText = `Read on World Top News: ${article.title}\n${shareFooter}`;

    try {
      await Share.share({
        title: article.title,
        text: shareText,
        url: article.link,
        dialogTitle: 'Share World News'
      });
    } catch {
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: shareText,
          url: article.link
        }).catch(() => {});
      } else {
        await navigator.clipboard.writeText(`${article.title}\n${article.link}\n${shareFooter}`);
        alert('News link copied to clipboard!');
      }
    }
  }

  private async toggleBookmark(article: NewsArticle) {
    const index = this.bookmarkedArticles.findIndex(b => b.article_id === article.article_id);
    if (index >= 0) {
      this.bookmarkedArticles.splice(index, 1);
    } else {
      this.bookmarkedArticles.unshift(article);
    }
    await this.saveBookmarks();
  }

  private async loadBookmarks() {
    try {
      const { value } = await Preferences.get({ key: 'wtn_saved_bookmarks' });
      if (value) {
        this.bookmarkedArticles = JSON.parse(value);
      }
    } catch {
      const local = localStorage.getItem('wtn_saved_bookmarks');
      if (local) this.bookmarkedArticles = JSON.parse(local);
    }
  }

  private async saveBookmarks() {
    const data = JSON.stringify(this.bookmarkedArticles);
    try {
      await Preferences.set({ key: 'wtn_saved_bookmarks', value: data });
    } catch {
      localStorage.setItem('wtn_saved_bookmarks', data);
    }
  }

  private async showCategoryPicker() {
    const actionSheet = document.createElement('ion-action-sheet') as any;
    actionSheet.header = 'Select News Category';
    actionSheet.buttons = [
      { text: '🔥 Top Stories', handler: () => this.setCategory('top') },
      { text: '💻 Technology', handler: () => this.setCategory('technology') },
      { text: '⚽ Sports', handler: () => this.setCategory('sports') },
      { text: '💼 Business', handler: () => this.setCategory('business') },
      { text: '🔬 Science', handler: () => this.setCategory('science') },
      { text: '🎬 Entertainment', handler: () => this.setCategory('entertainment') },
      { text: '🏥 Health', handler: () => this.setCategory('health') },
      { text: 'Cancel', role: 'cancel' }
    ];
    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  private setCategory(cat: string) {
    if (this.currentCategory !== cat) {
      this.currentCategory = cat;
      document.querySelectorAll('.category-chip').forEach(c => {
        const el = c as HTMLElement;
        if (el.dataset?.cat === cat) {
          el.removeAttribute('outline');
        } else {
          el.setAttribute('outline', 'true');
        }
      });
      this.switchTab('feed');
      this.fetchNews(true);
    } else {
      this.switchTab('feed');
    }
  }

  private async showCountryPicker() {
    const actionSheet = document.createElement('ion-action-sheet') as any;
    actionSheet.header = 'Select Country Edition';
    actionSheet.buttons = [
      { text: '🇮🇳 India', handler: () => this.setCountry('in') },
      { text: '🇺🇸 United States', handler: () => this.setCountry('us') },
      { text: '🇬🇧 United Kingdom', handler: () => this.setCountry('gb') },
      { text: '🌍 Global / Worldwide', handler: () => this.setCountry('all') },
      { text: 'Cancel', role: 'cancel' }
    ];
    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  private setCountry(country: string) {
    if (this.currentCountry !== country) {
      this.currentCountry = country;
      this.fetchNews(true);
    }
  }

  private async showLanguagePicker() {
    const actionSheet = document.createElement('ion-action-sheet') as any;
    actionSheet.header = 'Select Language';
    actionSheet.buttons = [
      { text: 'English', handler: () => this.setLanguage('en') },
      { text: 'हिन्दी (Hindi)', handler: () => this.setLanguage('hi') },
      { text: 'Español (Spanish)', handler: () => this.setLanguage('es') },
      { text: 'Français (French)', handler: () => this.setLanguage('fr') },
      { text: 'Cancel', role: 'cancel' }
    ];
    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  private setLanguage(lang: string) {
    if (this.currentLanguage !== lang) {
      this.currentLanguage = lang;
      this.fetchNews(true);
    }
  }

  private async showProfileModal() {
    const actionSheet = document.createElement('ion-action-sheet') as any;
    actionSheet.header = 'My Profile & Settings';
    actionSheet.buttons = [
      { text: '🌐 Select Country Edition', handler: () => this.showCountryPicker() },
      { text: '🗣️ Select Language', handler: () => this.showLanguagePicker() },
      { text: '⭐ Saved Favorites', handler: () => this.switchTab('bookmarks') },
      { text: 'ℹ️ About & Compliance', handler: () => this.switchTab('about') },
      { text: 'Cancel', role: 'cancel' }
    ];
    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  private formatRelativeTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  }
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new WorldTopNewsApp();
});
