// i18n string tables for the Quill UI.
// Two complete locales are maintained: english (default) and indonesian.
// Every user-facing string in any page or script MUST be defined here, in
// both languages. There must be no English leak when the user switches to
// Indonesian.

export type Locale = 'english' | 'indonesian';

export interface MainPageStrings {
  documentTitle: string;
  brand: string;
  title: string;
  lede: string;
  settingsLink: string;
  signInLink: string;
  signOutLink: string;
  signedInAs: (name: string) => string;

  // Section labels
  briefNumber: string;
  briefTitle: string;
  briefMeta: string;

  // Modal
  confirmLabel: string;
  escToClose: string;

  // Result meta
  optionLabel: string;
  optionIndex: string;
  bodyMeta: string;
  narrativeMeta: string;
  tagsMeta: string;
  optionsMeta: string;
  chaptersMeta: string;
  chapterPrefix: string;
  chapterLoadingLabel: string;

  // Form fields
  topicLabel: string;
  topicPlaceholder: string;
  tagsLabel: string;
  tagsPlaceholder: string;
  tagsEmpty: string;
  keywordsLabel: string;
  keywordsPlaceholder: string;
  keywordsEmpty: string;
  authorStyleLabel: string;
  selectAuthor: string;
  customAuthorPlaceholder: string;
  newspaperStyleLabel: string;
  selectNewspaper: string;
  customNewspaperPlaceholder: string;
  selectLanguage: string;
  addButton: string;
  chapterCountLabel: string;
  chapterCountPlaceholder: string;
  typeLabel: string;
  typeArticle: string;
  typeShortStory: string;
  typeNews: string;
  typeShortNews: string;
  typeNovel: string;
  languageLabel: string;
  mainIdeaLabel: string;
  mainIdeaPlaceholder: string;
  generateButton: string;
  resetButton: string;

  // Author style optgroups
  authorOptgroupClassic: string;
  authorOptgroupFantasy: string;
  authorOptgroupContemporary: string;
  authorOptgroupIndonesian: string;
  authorOptgroupNonFiction: string;
  authorOptgroupOther: string;
  authorCustom: string;

  // Type select placeholder
  typePlaceholder: string;

  // Status / errors
  statusLabel: string;
  generating: string;
  errorLabel: string;
  apiKeyRequired: string;
  byokKeySet: string;
  byokKeyMissing: string;
  byokBannerTitle: string;
  byokBannerMsg: string;
  byokBannerCta: string;
  missingFields: string;
  tagsRequired: string;
  networkError: string;
  apiKeyQuotaExceeded: string;
  apiKeyInvalid: string;

  // Reset modal
  resetConfirmTitle: string;
  resetConfirmMessage: string;
  cancelButton: string;
  resetModalButton: string;

  // Sign-out confirm modal
  signOutConfirmTitle: string;
  signOutConfirmMessage: string;
  signOutConfirmButton: string;
  signOutKeepKeyLabel: string;

  // Loading facts
  loadingFacts: string[];

  // Result
  refinedTags: string;
  selectTitle: string;
  selectSubtitle: string;
  content: string;
  exportMarkdown: string;
  exportRTF: string;
  novelTitle: string;
  synopsis: string;
  outline: string;
  chapter: string;
  generateChapter: string;
  generatingChapter: string;
  regenerateChapter: string;
  exportChapter: string;

  // Settings link in topbar
  settingsTooltip: string;
  signInTooltip: string;
  signOutTooltip: string;

  // Workspace integration
  saveToWorkspace: string;
  savedToWorkspace: string;
  workspaceAuthRequired: string;
}

export interface WorkspacePageStrings {
  documentTitle: string;
  title: string;
  lede: string;

  // Filter tabs
  filterAll: string;
  filterDraft: string;
  filterFinal: string;

  // Table headers
  colStatus: string;
  colTitle: string;
  colType: string;
  colDate: string;
  colActions: string;

  // Status labels
  statusDraft: string;
  statusFinal: string;

  // Actions
  actionEdit: string;
  actionDelete: string;
  actionSave: string;
  actionMarkFinal: string;
  actionMarkDraft: string;
  actionClose: string;

  // Editor
  editorTitlePlaceholder: string;
  editorContentPlaceholder: string;
  autosaveActive: string;
  autosaveLabel: string;
  unsavedChanges: string;

  // Empty state
  emptyTitle: string;
  emptyMsg: string;
  emptyCtaLabel: string;

  // Delete modal
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  cancelButton: string;
  deleteConfirmButton: string;

  // Toasts / errors
  loadError: string;
  saveSuccess: string;
  saveError: string;
  deleteSuccess: string;
  deleteError: string;
  authRequired: string;

  // Content type labels
  typeArticle: string;
  typeShortStory: string;
  typeNews: string;
  typeShortNews: string;
  typeNovel: string;

  // Shared nav/modal strings
  confirmLabel: string;
  escToClose: string;
  signInLink: string;
  signInTooltip: string;
  signOutTooltip: string;
}

export interface SettingsPageStrings {
  documentTitle: string;
  brand: string;
  title: string;
  lede: string;
  backLink: string;
  configNumber: string;
  configTitle: string;

  // Modal
  confirmLabel: string;
  escToClose: string;

  languageSection: string;
  languageMeta: string;
  interfaceLanguageLabel: string;
  languageHelp: string;
  selectLanguage: string;

  apiSection: string;
  apiMeta: string;
  apiInstructions: string;
  apiSteps: string[];
  apiKeyLabel: string;
  saveButton: string;
  removeButton: string;
  removeConfirmTitle: string;
  removeConfirmMessage: string;
  cancelButton: string;
  removeModalButton: string;

  signOutConfirmTitle: string;
  signOutConfirmMessage: string;
  signOutConfirmButton: string;
  signOutKeepKeyLabel: string;

  apiKeySaved: string;
  apiKeyVerified: string;
  apiKeyVerificationFailed: string;
  apiKeySaveError: string;
  apiKeyQuotaExceeded: string;
  apiKeyInvalid: string;
  networkError: string;
  pleaseEnterApiKey: string;
  apiKeyRemoved: string;

  byokKeySet: string;
  byokKeyMissing: string;
  byokNoticeTitle: string;
  byokNoticeMsg: string;

  signInLink: string;
  signOutLink: string;
  signedInAs: (name: string) => string;
  signInTooltip: string;
  signOutTooltip: string;
}

export interface AuthPageStrings {
  documentTitle: string;
  brand: string;
  title: string;
  backLink: string;

  introTitle: string;
  introBody: string;

  signInTab: string;
  signUpTab: string;

  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;

  signInButton: string;
  signUpButton: string;
  googleButton: string;
  orDivider: string;
  switchToSignUp: string;
  switchToSignIn: string;
  forgotPasswordLink: string;

  invalidEmail: string;
  weakPassword: string;
  emailInUse: string;
  wrongCredentials: string;
  networkError: string;
  tooManyRequests: string;
  genericError: string;
  missingFields: string;
  popupClosed: string;
  resetEmailSent: (email: string) => string;
  resetEmailMissing: string;

  signingIn: string;
  signingUp: string;
  signingOut: string;
  redirecting: string;

  signInSuccess: string;
  signUpSuccess: string;
  signOutSuccess: string;

  signedInAs: (name: string) => string;
  signOutButton: string;
}

export interface AboutPageStrings {
  documentTitle: string;
  brand: string;
  title: string;
  lede: string;

  visionTitle: string;
  visionBody: string;
  techTitle: string;
  techBody: string;
  authorsTitle: string;
  authorsBody: string;
  byokTitle: string;
  byokBody: string;

  section01Number: string;
  section01Title: string;
  section01Meta: string;
  section02Number: string;
  section02Title: string;
  section02Meta: string;
  section03Number: string;
  section03Title: string;
  section03Meta: string;
}

export const MAIN_STRINGS: Record<Locale, MainPageStrings> = {
  english: {
    documentTitle: 'Quill™ \u2014 AI Writing Assistant',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> AI WRITING ASSISTANT <span class="accent-dot">/</span> ED. 02',
    title: 'Quill<span class="brand-tm">™</span>.',
    lede: 'An editorial writing instrument powered by AI. Long-form articles, short stories, news briefs and novel outlines — drafted with author-style precision.',
    settingsLink: 'SETTINGS →',
    signInLink: 'SIGN IN',
    signOutLink: 'SIGN OUT',
    signedInAs: (n: string) => `Signed in as ${n}`,

    briefNumber: '02',
    briefTitle: 'Brief — Generator',
    briefMeta: 'FIELDS 01 / 09',

    confirmLabel: 'CONFIRM',
    escToClose: 'ESC TO CLOSE',
    optionLabel: 'OPTION',
    optionIndex: 'OPTION {n:02}',
    bodyMeta: 'BODY',
    narrativeMeta: 'NARRATIVE',
    tagsMeta: 'TAGS / {n}',
    optionsMeta: 'OPTIONS / {n}',
    chaptersMeta: 'CHAPTERS / {n}',
    chapterPrefix: 'CH / ',
    chapterLoadingLabel: 'GENERATING',

    topicLabel: 'Topic *',
    topicPlaceholder: 'e.g. The architecture of memory, monsoon economies',
    tagsLabel: 'Tags',
    tagsPlaceholder: 'Add a tag and press Enter',
    tagsEmpty: 'No tags yet',
    keywordsLabel: 'Keywords',
    keywordsPlaceholder: 'Add a keyword and press Enter',
    keywordsEmpty: 'No keywords yet',
    authorStyleLabel: 'Author Style *',
    selectAuthor: 'Select an author',
    customAuthorPlaceholder: 'Enter custom author name',
    newspaperStyleLabel: 'Newspaper Style *',
    selectNewspaper: 'Select newspaper style',
    customNewspaperPlaceholder: 'Enter custom newspaper style',
    selectLanguage: 'Select language',
    addButton: 'Add',
    chapterCountLabel: 'Chapters *',
    chapterCountPlaceholder: 'e.g. 10',
    typeLabel: 'Type *',
    typeArticle: 'Article',
    typeShortStory: 'Short Story',
    typeNews: 'News Article',
    typeShortNews: 'Short News',
    typeNovel: 'Novel Outline',
    languageLabel: 'Language *',
    mainIdeaLabel: 'Main Idea / Plot',
    mainIdeaPlaceholder: 'Describe the main idea, plot or concept the AI should build upon.',
    generateButton: 'Generate Content',
    resetButton: 'Reset All',

    authorOptgroupClassic: 'Classic & Literary',
    authorOptgroupFantasy: 'Fantasy & Sci-Fi',
    authorOptgroupContemporary: 'Contemporary & Thriller',
    authorOptgroupIndonesian: 'Indonesian Authors',
    authorOptgroupNonFiction: 'Non-Fiction',
    authorOptgroupOther: 'Other',
    authorCustom: 'Custom (enter below)',

    typePlaceholder: 'Select type',

    statusLabel: 'Status',
    generating: 'Generating your content with AI…',
    errorLabel: 'Error',
    apiKeyRequired: 'Please set your Gemini API key in Settings first.',
    byokKeySet: 'Key Set',
    byokKeyMissing: 'No API Key',
    byokBannerTitle: 'Bring Your Own Key',
    byokBannerMsg: 'Quill<span class="brand-tm">™</span> is BYOK — Bring Your Own Key. Add your Gemini API key in Settings to start generating. The key is stored only in this browser and sent per-request via the <code>X-User-API-Key</code> header. The server never persists it.',
    byokBannerCta: 'Open Settings →',
    missingFields: 'Missing required fields',
    tagsRequired: 'Please add at least one tag',
    networkError: 'Network error. Please check your internet connection and try again.',
    apiKeyQuotaExceeded: 'API quota exceeded. Please check your Gemini API billing/limits.',
    apiKeyInvalid: 'Invalid API key. Please check that your Gemini API key is correct and enabled.',

    resetConfirmTitle: 'Reset All Data',
    resetConfirmMessage: 'Are you sure you want to reset all data? This will clear your form and generated content.',
    cancelButton: 'Cancel',
    resetModalButton: 'Reset',

    signOutConfirmTitle: 'Sign out?',
    signOutConfirmMessage: 'You will be signed out of your account. Your saved articles and form drafts will stay on this device until you sign back in.',
    signOutConfirmButton: 'Sign out',
    signOutKeepKeyLabel: 'Keep my saved API key for next sign-in',

    loadingFacts: [
      'The quill pen was invented in the 6th century.',
      'The first quills came from swan feathers.',
      'Shakespeare wrote 37 plays and 154 sonnets.',
      'Hemingway wrote standing up.',
      'The first newspaper was published in Strasbourg, 1605.',
      'The novel form emerged in 18th century England.',
      'AI can analyze writing styles of any author.',
      'Typography evolved from handwritten scripts to digital fonts.',
      'Writing systems developed independently in four ancient civilizations.',
      'The first printing press was invented by Gutenberg in 1450.',
      'Mark Twain was the first author to submit a typewritten manuscript.',
      'Literature has been used as propaganda since ancient Rome.',
      'The shortest story ever written is just six words long.',
      'Writing on clay tablets began over 5,000 years ago.',
      'The first copyright law was established in Britain in 1710.',
    ],

    refinedTags: 'Refined Tags',
    selectTitle: 'Select Title',
    selectSubtitle: 'Select Subtitle',
    content: 'Content',
    exportMarkdown: 'Export as Markdown',
    exportRTF: 'Export as RTF',
    novelTitle: 'Novel Title',
    synopsis: 'Synopsis',
    outline: 'Outline',
    chapter: 'Chapter',
    generateChapter: 'Generate Chapter',
    generatingChapter: 'Generating…',
    regenerateChapter: 'Regenerate Chapter',
    exportChapter: 'Export Chapter',

    settingsTooltip: 'Settings',
    signInTooltip: 'Sign in',
    signOutTooltip: 'Sign out',

    saveToWorkspace: 'Save to Workspace',
    savedToWorkspace: 'Saved ✓',
    workspaceAuthRequired: 'Please sign in to save to your Workspace.',
  },

  indonesian: {
    documentTitle: 'Quill™ \u2014 Asisten Menulis AI',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> ASISTEN MENULIS AI <span class="accent-dot">/</span> ED. 02',
    title: 'Quill<span class="brand-tm">™</span>.',
    lede: 'Instrumen penulisan editorial bertenaga AI. Artikel panjang, cerita pendek, berita singkat, dan rangkuman novel — disusun dengan presisi gaya penulis.',
    settingsLink: 'PENGATURAN →',
    signInLink: 'MASUK',
    signOutLink: 'KELUAR',
    signedInAs: (n: string) => `Masuk sebagai ${n}`,

    briefNumber: '02',
    briefTitle: 'Brief — Generator',
    briefMeta: 'KOLOM 01 / 09',

    confirmLabel: 'KONFIRMASI',
    escToClose: 'ESC UNTUK TUTUP',
    optionLabel: 'OPSI',
    optionIndex: 'OPSI {n:02}',
    bodyMeta: 'ISI',
    narrativeMeta: 'NARASI',
    tagsMeta: 'TAG / {n}',
    optionsMeta: 'PILIHAN / {n}',
    chaptersMeta: 'BAB / {n}',
    chapterPrefix: 'BAB / ',
    chapterLoadingLabel: 'MENGHASILKAN',

    topicLabel: 'Topik *',
    topicPlaceholder: 'cth. Arsitektur memori, ekonomi monsoon',
    tagsLabel: 'Tag',
    tagsPlaceholder: 'Tambahkan tag dan tekan Enter',
    tagsEmpty: 'Belum ada tag',
    keywordsLabel: 'Kata Kunci',
    keywordsPlaceholder: 'Tambahkan kata kunci dan tekan Enter',
    keywordsEmpty: 'Belum ada kata kunci',
    authorStyleLabel: 'Gaya Penulis *',
    selectAuthor: 'Pilih penulis',
    customAuthorPlaceholder: 'Masukkan nama penulis kustom',
    newspaperStyleLabel: 'Gaya Koran *',
    selectNewspaper: 'Pilih gaya koran',
    customNewspaperPlaceholder: 'Masukkan gaya koran kustom',
    selectLanguage: 'Pilih bahasa',
    addButton: 'Tambah',
    chapterCountLabel: 'Jumlah Bab *',
    chapterCountPlaceholder: 'cth. 10',
    typeLabel: 'Tipe *',
    typeArticle: 'Artikel',
    typeShortStory: 'Cerita Pendek',
    typeNews: 'Artikel Berita',
    typeShortNews: 'Berita Singkat',
    typeNovel: 'Rangkuman Novel',
    languageLabel: 'Bahasa *',
    mainIdeaLabel: 'Ide Utama / Alur',
    mainIdeaPlaceholder: 'Jelaskan ide utama, alur, atau konsep yang ingin dibangun oleh AI.',
    generateButton: 'Hasilkan Konten',
    resetButton: 'Reset Semua',

    authorOptgroupClassic: 'Klasik & Sastra',
    authorOptgroupFantasy: 'Fantasi & Fiksi Ilmiah',
    authorOptgroupContemporary: 'Kontemporer & Thriller',
    authorOptgroupIndonesian: 'Penulis Indonesia',
    authorOptgroupNonFiction: 'Non-Fiksi',
    authorOptgroupOther: 'Lainnya',
    authorCustom: 'Kustom (isi di bawah)',

    typePlaceholder: 'Pilih tipe',

    statusLabel: 'Status',
    generating: 'Menghasilkan konten Anda dengan AI…',
    errorLabel: 'Kesalahan',
    apiKeyRequired: 'Silakan atur kunci API Gemini Anda di Pengaturan terlebih dahulu.',
    byokKeySet: 'Kunci Disetel',
    byokKeyMissing: 'Tanpa Kunci',
    byokBannerTitle: 'Bawa Kunci Anda Sendiri',
    byokBannerMsg: 'Quill<span class="brand-tm">™</span> adalah BYOK — Bawa Kunci Anda Sendiri. Tambahkan kunci API Gemini Anda di Pengaturan untuk mulai menghasilkan. Kunci hanya disimpan di peramban ini dan dikirim per-request lewat header <code>X-User-API-Key</code>. Server tidak pernah menyimpannya.',
    byokBannerCta: 'Buka Pengaturan →',
    missingFields: 'Kolom wajib belum lengkap',
    tagsRequired: 'Silakan tambahkan setidaknya satu tag',
    networkError: 'Kesalahan jaringan. Periksa koneksi internet Anda dan coba lagi.',
    apiKeyQuotaExceeded: 'Kuota API terlampaui. Periksa tagihan/batas Gemini API Anda.',
    apiKeyInvalid: 'Kunci API tidak valid. Periksa kunci API Gemini Anda.',

    resetConfirmTitle: 'Reset Semua Data',
    resetConfirmMessage: 'Apakah Anda yakin ingin mereset semua data? Formulir dan konten akan dihapus.',
    cancelButton: 'Batal',
    resetModalButton: 'Reset',

    signOutConfirmTitle: 'Keluar?',
    signOutConfirmMessage: 'Anda akan keluar dari akun. Artikel dan draf formulir yang tersimpan tetap ada di perangkat ini sampai Anda masuk lagi.',
    signOutConfirmButton: 'Keluar',
    signOutKeepKeyLabel: 'Simpan kunci API saya untuk masuk berikutnya',

    loadingFacts: [
      'Pena quill ditemukan pada abad ke-6.',
      'Quill pertama berasal dari bulu angsa.',
      'Shakespeare menulis 37 drama dan 154 soneta.',
      'Hemingway menulis sambil berdiri.',
      'Surat kabar pertama diterbitkan di Strasbourg, 1605.',
      'Bentuk novel muncul di Inggris abad ke-18.',
      'AI dapat menganalisis gaya tulisan penulis mana pun.',
      'Tipografi berkembang dari naskah tulisan tangan ke font digital.',
      'Sistem tulis berkembang independen di empat peradaban kuno.',
      'Mesin cetak pertama ditemukan Gutenberg pada 1450.',
      'Mark Twain adalah penulis pertama yang menyerahkan naskah ketik.',
      'Sastra telah digunakan sebagai propaganda sejak Romawi kuno.',
      'Cerita terpendek yang pernah ditulis hanya enam kata.',
      'Penulisan di tablet tanah liat dimulai lebih dari 5.000 tahun lalu.',
      'Hukum hak cipta pertama didirikan di Inggris pada 1710.',
    ],

    refinedTags: 'Tag yang Dimurnikan',
    selectTitle: 'Pilih Judul',
    selectSubtitle: 'Pilih Subjudul',
    content: 'Konten',
    exportMarkdown: 'Ekspor sebagai Markdown',
    exportRTF: 'Ekspor sebagai RTF',
    novelTitle: 'Judul Novel',
    synopsis: 'Sinopsis',
    outline: 'Rangkuman',
    chapter: 'Bab',
    generateChapter: 'Hasilkan Bab',
    generatingChapter: 'Menghasilkan…',
    regenerateChapter: 'Hasilkan Ulang',
    exportChapter: 'Ekspor Bab',

    settingsTooltip: 'Pengaturan',
    signInTooltip: 'Masuk',
    signOutTooltip: 'Keluar',

    saveToWorkspace: 'Simpan ke Ruang Kerja',
    savedToWorkspace: 'Tersimpan ✓',
    workspaceAuthRequired: 'Silakan masuk untuk menyimpan ke Ruang Kerja Anda.',
  },
};

export const WORKSPACE_STRINGS: Record<Locale, WorkspacePageStrings> = {
  english: {
    documentTitle: 'Quill™ — Workspace',
    title: 'Workspace.',
    lede: 'Your saved drafts and finished pieces. Edit inline, autosave while you write.',

    filterAll: 'All',
    filterDraft: 'Draft',
    filterFinal: 'Final',

    colStatus: 'STATUS',
    colTitle: 'TITLE',
    colType: 'TYPE',
    colDate: 'DATE',
    colActions: 'ACTIONS',

    statusDraft: 'DRAFT',
    statusFinal: 'FINAL',

    actionEdit: 'Edit',
    actionDelete: 'Delete',
    actionSave: 'Save',
    actionMarkFinal: 'Mark Final',
    actionMarkDraft: 'Mark Draft',
    actionClose: 'Close',

    editorTitlePlaceholder: 'Draft title…',
    editorContentPlaceholder: 'Your content…',
    autosaveActive: 'Autosave on',
    autosaveLabel: 'AUTOSAVE',
    unsavedChanges: 'Unsaved changes',

    emptyTitle: 'No drafts yet.',
    emptyMsg: 'Generate an article and save it to your Workspace to see it here.',
    emptyCtaLabel: 'Go to Generator →',

    deleteConfirmTitle: 'Delete Draft',
    deleteConfirmMessage: 'This will permanently delete the draft. This action cannot be undone.',
    cancelButton: 'Cancel',
    deleteConfirmButton: 'Delete',

    loadError: 'Failed to load drafts. Please try again.',
    saveSuccess: 'Draft saved.',
    saveError: 'Failed to save. Please try again.',
    deleteSuccess: 'Draft deleted.',
    deleteError: 'Failed to delete. Please try again.',
    authRequired: 'Please sign in to access your workspace.',

    typeArticle: 'Article',
    typeShortStory: 'Short Story',
    typeNews: 'News',
    typeShortNews: 'Short News',
    typeNovel: 'Novel',

    confirmLabel: 'CONFIRM',
    escToClose: 'ESC TO CLOSE',
    signInLink: 'SIGN IN',
    signInTooltip: 'Sign in',
    signOutTooltip: 'Sign out',
  },

  indonesian: {
    documentTitle: 'Quill™ — Ruang Kerja',
    title: 'Ruang Kerja.',
    lede: 'Draf dan karya selesai Anda. Edit langsung, simpan otomatis saat menulis.',

    filterAll: 'Semua',
    filterDraft: 'Draf',
    filterFinal: 'Final',

    colStatus: 'STATUS',
    colTitle: 'JUDUL',
    colType: 'TIPE',
    colDate: 'TANGGAL',
    colActions: 'AKSI',

    statusDraft: 'DRAF',
    statusFinal: 'FINAL',

    actionEdit: 'Edit',
    actionDelete: 'Hapus',
    actionSave: 'Simpan',
    actionMarkFinal: 'Tandai Final',
    actionMarkDraft: 'Tandai Draf',
    actionClose: 'Tutup',

    editorTitlePlaceholder: 'Judul draf…',
    editorContentPlaceholder: 'Konten Anda…',
    autosaveActive: 'Simpan otomatis aktif',
    autosaveLabel: 'SIMPAN-OTO',
    unsavedChanges: 'Ada perubahan belum disimpan',

    emptyTitle: 'Belum ada draf.',
    emptyMsg: 'Hasilkan artikel dan simpan ke Ruang Kerja Anda untuk melihatnya di sini.',
    emptyCtaLabel: 'Buka Generator →',

    deleteConfirmTitle: 'Hapus Draf',
    deleteConfirmMessage: 'Draf ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
    cancelButton: 'Batal',
    deleteConfirmButton: 'Hapus',

    loadError: 'Gagal memuat draf. Coba lagi.',
    saveSuccess: 'Draf disimpan.',
    saveError: 'Gagal menyimpan. Coba lagi.',
    deleteSuccess: 'Draf dihapus.',
    deleteError: 'Gagal menghapus. Coba lagi.',
    authRequired: 'Silakan masuk untuk mengakses ruang kerja Anda.',

    typeArticle: 'Artikel',
    typeShortStory: 'Cerita Pendek',
    typeNews: 'Berita',
    typeShortNews: 'Berita Singkat',
    typeNovel: 'Novel',

    confirmLabel: 'KONFIRMASI',
    escToClose: 'ESC UNTUK TUTUP',
    signInLink: 'MASUK',
    signInTooltip: 'Masuk',
    signOutTooltip: 'Keluar',
  },
};

export const SETTINGS_STRINGS: Record<Locale, SettingsPageStrings> = {
  english: {
    documentTitle: 'Quill™ \u2014 Settings',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> SETTINGS <span class="accent-dot">/</span> ED. 02',
    title: 'Settings.',
    lede: 'Configure the language of the interface and your Gemini API key. All values are stored locally in this browser.',
    backLink: '← Back to Generator',
    configNumber: '01',
    configTitle: 'Configuration',

    confirmLabel: 'CONFIRM',
    escToClose: 'ESC TO CLOSE',

    languageSection: 'Language',
    languageMeta: 'UI / LOCALE',
    interfaceLanguageLabel: 'Interface Language',
    languageHelp: 'Choose the language for the user interface.',
    selectLanguage: 'Select language',

    apiSection: 'Gemini AI Configuration',
    apiMeta: 'CREDENTIALS',
    apiInstructions: 'How to get your API key',
    apiSteps: [
      '<a href="https://aistudio.google.com/app/apikey" target="_blank">Go to Google AI Studio</a>',
      'Sign in with your Google account',
      'Create a new API key',
      'Copy the key and paste it below',
    ],
    apiKeyLabel: 'Gemini API Key *',
    saveButton: 'Save API Key',
    removeButton: 'Remove API Key',
    removeConfirmTitle: 'Remove API Key',
    removeConfirmMessage: 'Are you sure you want to remove the API key?',
    cancelButton: 'Cancel',
    removeModalButton: 'Remove',

    signOutConfirmTitle: 'Sign out?',
    signOutConfirmMessage: 'You will be signed out of your account. Your API key and articles stay on this device until you sign back in.',
    signOutConfirmButton: 'Sign out',
    signOutKeepKeyLabel: 'Keep my saved API key for next sign-in',

    apiKeySaved: 'API key saved successfully.',
    apiKeyVerified: 'API key verified and saved successfully.',
    apiKeyVerificationFailed: 'API key saved but verification failed: ',
    apiKeySaveError: 'API key saved but could not verify: ',
    apiKeyQuotaExceeded: 'API quota exceeded. Please check your Gemini API billing/limits.',
    apiKeyInvalid: 'Invalid API key. Please check that your Gemini API key is correct and enabled.',
    networkError: 'Network error. Please check your internet connection and try again.',
    pleaseEnterApiKey: 'Please enter an API key',
    apiKeyRemoved: 'API key removed successfully.',

    byokKeySet: 'Key Set',
    byokKeyMissing: 'No API Key',
    byokNoticeTitle: 'Bring Your Own Key',
    byokNoticeMsg: 'Quill<span class="brand-tm">™</span> is BYOK — Bring Your Own Key. The server has no default Gemini key, so every visitor must provide their own. Your key is stored only in this browser (<code>localStorage</code>) and is sent per-request as the <code>X-User-API-Key</code> header. The server never persists, logs, or shares it.',

    signInLink: 'SIGN IN',
    signOutLink: 'SIGN OUT',
    signedInAs: (n: string) => `Signed in as ${n}`,
    signInTooltip: 'Sign in',
    signOutTooltip: 'Sign out',
  },

  indonesian: {
    documentTitle: 'Quill™ \u2014 Pengaturan',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> PENGATURAN <span class="accent-dot">/</span> ED. 02',
    title: 'Pengaturan.',
    lede: 'Konfigurasikan bahasa antarmuka dan kunci API Gemini Anda. Semua nilai disimpan secara lokal di peramban ini.',
    backLink: '← Kembali ke Generator',
    configNumber: '01',
    configTitle: 'Konfigurasi',

    confirmLabel: 'KONFIRMASI',
    escToClose: 'ESC UNTUK TUTUP',

    languageSection: 'Bahasa',
    languageMeta: 'UI / LOKAL',
    interfaceLanguageLabel: 'Bahasa Antarmuka',
    languageHelp: 'Pilih bahasa untuk antarmuka pengguna.',
    selectLanguage: 'Pilih bahasa',

    apiSection: 'Konfigurasi Gemini AI',
    apiMeta: 'KREDENSIAL',
    apiInstructions: 'Cara mendapatkan kunci API',
    apiSteps: [
      '<a href="https://aistudio.google.com/app/apikey" target="_blank">Kunjungi Google AI Studio</a>',
      'Masuk dengan akun Google Anda',
      'Buat kunci API baru',
      'Salin kunci dan tempel di bawah',
    ],
    apiKeyLabel: 'Kunci API Gemini *',
    saveButton: 'Simpan Kunci API',
    removeButton: 'Hapus Kunci API',
    removeConfirmTitle: 'Hapus Kunci API',
    removeConfirmMessage: 'Apakah Anda yakin ingin menghapus kunci API?',
    cancelButton: 'Batal',
    removeModalButton: 'Hapus',

    signOutConfirmTitle: 'Keluar?',
    signOutConfirmMessage: 'Anda akan keluar dari akun. Kunci API dan artikel tetap ada di perangkat ini sampai Anda masuk lagi.',
    signOutConfirmButton: 'Keluar',
    signOutKeepKeyLabel: 'Simpan kunci API saya untuk masuk berikutnya',

    apiKeySaved: 'Kunci API berhasil disimpan.',
    apiKeyVerified: 'Kunci API diverifikasi dan berhasil disimpan.',
    apiKeyVerificationFailed: 'Kunci API disimpan tetapi verifikasi gagal: ',
    apiKeySaveError: 'Kunci API disimpan tetapi tidak dapat diverifikasi: ',
    apiKeyQuotaExceeded: 'Kuota API terlampaui. Periksa tagihan/batas Gemini API Anda.',
    apiKeyInvalid: 'Kunci API tidak valid. Periksa kunci API Gemini Anda.',
    networkError: 'Kesalahan jaringan. Periksa koneksi internet Anda dan coba lagi.',
    pleaseEnterApiKey: 'Silakan masukkan kunci API',
    apiKeyRemoved: 'Kunci API berhasil dihapus.',

    byokKeySet: 'Kunci Disetel',
    byokKeyMissing: 'Tanpa Kunci',
    byokNoticeTitle: 'Bawa Kunci Anda Sendiri',
    byokNoticeMsg: 'Quill<span class="brand-tm">™</span> adalah BYOK — Bawa Kunci Anda Sendiri. Server tidak memiliki kunci Gemini bawaan, jadi setiap pengunjung harus menyediakan kuncinya sendiri. Kunci Anda hanya disimpan di peramban ini (<code>localStorage</code>) dan dikirim per-request sebagai header <code>X-User-API-Key</code>. Server tidak pernah menyimpan, mencatat, atau membagikannya.',

    signInLink: 'MASUK',
    signOutLink: 'KELUAR',
    signedInAs: (n: string) => `Masuk sebagai ${n}`,
    signInTooltip: 'Masuk',
    signOutTooltip: 'Keluar',
  },
};

export const AUTH_STRINGS: Record<Locale, AuthPageStrings> = {
  english: {
    documentTitle: 'Quill™ \u2014 Sign In',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> SIGN IN <span class="accent-dot">/</span> ED. 02',
    title: 'Sign in.',
    backLink: '← Back to Generator',

    introTitle: 'Sign in to Quill<span class="brand-tm">™</span>.',
    introBody: 'Quill<span class="brand-tm">™</span> is BYOK. Sign in to keep your Gemini API key and saved articles tied to your account across devices. The server never sees or stores your key — it lives only in this browser.',

    signInTab: 'Sign In',
    signUpTab: 'Create Account',

    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    displayNameLabel: 'Display name (optional)',
    displayNamePlaceholder: 'How should we greet you?',

    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    googleButton: 'Continue with Google',
    orDivider: 'or',
    switchToSignUp: 'No account yet? Create one →',
    switchToSignIn: 'Already have an account? Sign in →',
    forgotPasswordLink: 'Forgot password?',

    invalidEmail: 'Please enter a valid email address.',
    weakPassword: 'Password must be at least 6 characters.',
    emailInUse: 'An account with this email already exists. Try signing in instead.',
    wrongCredentials: 'Wrong email or password. Please try again.',
    networkError: 'Network error. Please check your connection and try again.',
    tooManyRequests: 'Too many attempts. Please wait a moment and try again.',
    genericError: 'Something went wrong. Please try again.',
    missingFields: 'Email and password are required.',
    popupClosed: 'Sign-in popup was closed before completing. Please try again.',
    resetEmailSent: (e: string) => `Password reset link sent to ${e}. Check your inbox.`,
    resetEmailMissing: 'Please enter your email address to reset your password.',

    signingIn: 'Signing in…',
    signingUp: 'Creating account…',
    signingOut: 'Signing out…',
    redirecting: 'Redirecting…',

    signInSuccess: 'Signed in. Redirecting…',
    signUpSuccess: 'Account created. Redirecting…',
    signOutSuccess: 'Signed out.',

    signedInAs: (n: string) => `Signed in as ${n}`,
    signOutButton: 'Sign out',
  },

  indonesian: {
    documentTitle: 'Quill™ \u2014 Masuk',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> MASUK <span class="accent-dot">/</span> ED. 02',
    title: 'Masuk.',
    backLink: '← Kembali ke Generator',

    introTitle: 'Masuk ke Quill<span class="brand-tm">™</span>.',
    introBody: 'Quill<span class="brand-tm">™</span> adalah BYOK. Masuk untuk menjaga kunci API Gemini dan artikel Anda tetap terhubung ke akun ini di semua perangkat. Server tidak pernah melihat atau menyimpan kunci Anda — kunci hanya ada di peramban ini.',

    signInTab: 'Masuk',
    signUpTab: 'Buat Akun',

    emailLabel: 'Surel',
    emailPlaceholder: 'anda@contoh.com',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Minimal 6 karakter',
    displayNameLabel: 'Nama tampilan (opsional)',
    displayNamePlaceholder: 'Bagaimana kami menyapa Anda?',

    signInButton: 'Masuk',
    signUpButton: 'Buat Akun',
    googleButton: 'Lanjut dengan Google',
    orDivider: 'atau',
    switchToSignUp: 'Belum punya akun? Buat sekarang →',
    switchToSignIn: 'Sudah punya akun? Masuk →',
    forgotPasswordLink: 'Lupa kata sandi?',

    invalidEmail: 'Silakan masukkan alamat surel yang valid.',
    weakPassword: 'Kata sandi minimal 6 karakter.',
    emailInUse: 'Akun dengan surel ini sudah ada. Coba masuk saja.',
    wrongCredentials: 'Surel atau kata sandi salah. Coba lagi.',
    networkError: 'Kesalahan jaringan. Periksa koneksi Anda dan coba lagi.',
    tooManyRequests: 'Terlalu banyak percobaan. Tunggu sebentar dan coba lagi.',
    genericError: 'Terjadi kesalahan. Coba lagi.',
    missingFields: 'Surel dan kata sandi wajib diisi.',
    popupClosed: 'Jendela masuk ditutup sebelum selesai. Silakan coba lagi.',
    resetEmailSent: (e: string) => `Tautan reset kata sandi dikirim ke ${e}. Periksa kotak masuk Anda.`,
    resetEmailMissing: 'Masukkan surel Anda untuk mereset kata sandi.',

    signingIn: 'Sedang masuk…',
    signingUp: 'Membuat akun…',
    signingOut: 'Sedang keluar…',
    redirecting: 'Mengalihkan…',

    signInSuccess: 'Berhasil masuk. Mengalihkan…',
    signUpSuccess: 'Akun dibuat. Mengalihkan…',
    signOutSuccess: 'Berhasil keluar.',

    signedInAs: (n: string) => `Masuk sebagai ${n}`,
    signOutButton: 'Keluar',
  },
};

export const ABOUT_STRINGS: Record<Locale, AboutPageStrings> = {
  english: {
    documentTitle: 'Quill™ \u2014 About',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> ABOUT <span class="accent-dot">/</span> ED. 02',
    title: 'About.',
    lede: 'An editorial writing instrument for the neural era. High-fidelity author style mimicry meeting Swiss typographic precision.',

    visionTitle: 'Editorial Precision',
    visionBody: 'Quill is designed as a focused instrument for writers, editors, and journalists. We prioritize the structural integrity of long-form content over transient chat interactions.',
    techTitle: 'Neural Synthesis',
    techBody: 'Powered by the Google Gemini family of models, Quill utilizes recursive synthesis to generate coherent articles that maintain narrative tension and logical flow.',
    authorsTitle: 'The Style System',
    authorsBody: 'Our curated style engine enables the creation of content that echoes the cadence, vocabulary, and ideological leanings of history\'s most significant authors.',
    byokTitle: 'Privacy & Sovereignty',
    byokBody: 'Quill is BYOK (Bring Your Own Key). We do not persist your Gemini API key on our servers; your intelligence remains your own, stored only in your local browser environment.',

    section01Number: '01',
    section01Title: 'Vision',
    section01Meta: 'EDITORIAL / INSTRUMENT',
    section02Number: '02',
    section02Title: 'Technology',
    section02Meta: 'GEMINI / RECURSIVE',
    section03Number: '03',
    section03Title: 'Style Engine',
    section03Meta: 'LITERARY / ANALYTIC',
  },
  indonesian: {
    documentTitle: 'Quill™ \u2014 Tentang',
    brand: 'Quill<span class="brand-tm">™</span> <span class="accent-dot">/</span> TENTANG <span class="accent-dot">/</span> ED. 02',
    title: 'Tentang.',
    lede: 'Instrumen penulisan editorial untuk era neural. Peniruan gaya penulis berakurasi tinggi berpadu dengan presisi tipografi Swiss.',

    visionTitle: 'Presisi Editorial',
    visionBody: 'Quill dirancang sebagai instrumen terfokus bagi penulis, editor, dan jurnalis. Kami mengutamakan integritas struktural konten panjang di atas interaksi obrolan sementara.',
    techTitle: 'Sintesis Neural',
    techBody: 'Ditenagai oleh keluarga model Google Gemini, Quill menggunakan sintesis rekursif untuk menghasilkan artikel koheren yang menjaga ketegangan narasi dan alur logika.',
    authorsTitle: 'Sistem Gaya',
    authorsBody: 'Mesin gaya kurasi kami memungkinkan pembuatan konten yang menggemakan irama, kosakata, dan kecenderungan ideologis penulis-penulis paling signifikan dalam sejarah.',
    byokTitle: 'Privasi & Kedaulatan',
    byokBody: 'Quill adalah BYOK (Bawa Kunci Anda Sendiri). Kami tidak menyimpan kunci API Gemini Anda di server kami; kecerdasan Anda tetap milik Anda, hanya disimpan di lingkungan browser lokal Anda.',

    section01Number: '01',
    section01Title: 'Visi',
    section01Meta: 'EDITORIAL / INSTRUMEN',
    section02Number: '02',
    section02Title: 'Teknologi',
    section02Meta: 'GEMINI / REKURSIF',
    section03Number: '03',
    section03Title: 'Mesin Gaya',
    section03Meta: 'LITERATUR / ANALITIK',
  },
};

export interface CommonStrings {
  confirmLabel: string;
  escToClose: string;
  cancelButton: string;

  signOutConfirmTitle: string;
  signOutConfirmMessage: string;
  signOutConfirmButton: string;
  signOutKeepKeyLabel: string;

  byokSet: string;
  byokMissing: string;

  signInLink: string;
  signInTooltip: string;
  signOutTooltip: string;

  authAccount: string;
  authUID: string;
}

export const COMMON_STRINGS: Record<Locale, CommonStrings> = {
  english: {
    confirmLabel: 'CONFIRM',
    escToClose: 'ESC TO CLOSE',
    cancelButton: 'Cancel',

    signOutConfirmTitle: 'Sign Out',
    signOutConfirmMessage: 'Are you sure you want to sign out?',
    signOutConfirmButton: 'Sign Out',
    signOutKeepKeyLabel: 'Keep Gemini API key in this browser',

    byokSet: 'Key Set',
    byokMissing: 'No Key',

    signInLink: 'SIGN IN',
    signInTooltip: 'Sign in',
    signOutTooltip: 'Sign out',

    authAccount: 'Account',
    authUID: 'UID',
  },
  indonesian: {
    confirmLabel: 'KONFIRMASI',
    escToClose: 'ESC UNTUK TUTUP',
    cancelButton: 'Batal',

    signOutConfirmTitle: 'Keluar',
    signOutConfirmMessage: 'Apakah Anda yakin ingin keluar?',
    signOutConfirmButton: 'Keluar',
    signOutKeepKeyLabel: 'Simpan kunci API Gemini di browser ini',

    byokSet: 'Kunci Disetel',
    byokMissing: 'Tanpa Kunci',

    signInLink: 'MASUK',
    signInTooltip: 'Masuk',
    signOutTooltip: 'Keluar',

    authAccount: 'Akun',
    authUID: 'UID',
  },
};

export function getLocale(): Locale {
  // Browser-only helper. The server has no localStorage, so the call site
  // guards with `typeof localStorage !== 'undefined'`.
  const ls = (globalThis as { localStorage?: { getItem: (k: string) => string | null } }).localStorage;
  const stored = ls ? ls.getItem('uiLanguage') : null;
  return stored === 'indonesian' ? 'indonesian' : 'english';
}
