import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Github,
  Search,
  RefreshCcw,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Settings,
  HelpCircle,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Edit3,
  Sparkles,
  GitCommit,
  Globe2,
  X,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Info,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Loader2,
  Star,
  GitFork,
  CircleAlert,
  Lock,
  Archive,
  Languages,
  Cloud,
  CloudUpload,
  CloudDownload,
  MoreHorizontal,
  ChevronDown,
  FileSpreadsheet,
  Megaphone,
} from 'lucide-react';

/* ============================================================
   Constants
============================================================ */

const STORAGE_KEYS = {
  settings: 'chithubSettings',
  repoMeta: 'chithubRepoMeta',
};

const STATUS_OPTIONS = [
  '아이디어',
  '개발중',
  '테스트중',
  '배포완료',
  '수정필요',
  '보류',
  '아카이브',
];

const DEFAULT_CATEGORIES = [
  '교육뮤지컬',
  '국제교류',
  '학급운영',
  '문해력',
  '창작도구',
  '평가·피드백',
  '에듀테크',
  '자료정리',
  '기타',
];

const PRIORITY_OPTIONS = ['높음', '보통', '낮음'];
const TONE_OPTIONS = ['친근함', '전문가', '교사용', '학생용', '간결함'];

const SORT_OPTIONS = [
  { id: 'updated', label: { ko: '최근 업데이트순', en: 'Recently updated', ja: '更新が新しい順' } },
  { id: 'createdDesc', label: { ko: '생성일 최신순', en: 'Newest created', ja: '作成が新しい順' } },
  { id: 'createdAsc', label: { ko: '생성일 오래된순', en: 'Oldest created', ja: '作成が古い順' } },
  { id: 'name', label: { ko: '이름순', en: 'Name', ja: '名前順' } },
  { id: 'stars', label: { ko: 'Star 많은 순', en: 'Most stars', ja: 'スター数順' } },
  { id: 'status', label: { ko: '상태순', en: 'By status', ja: 'ステータス順' } },
  { id: 'priority', label: { ko: '우선순위순', en: 'By priority', ja: '優先度順' } },
];

/* ============================================================
   i18n
============================================================ */

const I18N = {
  ko: {
    appName: '칫허브',
    appEn: 'Chithub',
    tagline: 'GitHub 리포지토리를 불러오고, 나만의 웹앱 아카이브와 홍보 자료를 관리하는 대시보드',
    help: '도움말',
    settings: '설정',
    loadPublic: '공개 리포지토리 불러오기',
    loadMine: '내 리포지토리 불러오기',
    search: '검색',
    filter: '필터',
    edit: '편집',
    save: '저장하기',
    cancel: '취소',
    generatePromo: '홍보문 생성',
    copy: '복사하기',
    download: '다운로드하기',
    backup: 'JSON 백업',
    restore: 'JSON 복원',
    csv: 'CSV 다운로드',
    deleteToken: '저장된 토큰 삭제',
    security: '보안 안내',
    username: 'GitHub Username',
    token: 'Personal Access Token',
    saveTokenLabel: '이 브라우저에 토큰 저장',
    showToken: '토큰 보기',
    hideToken: '토큰 숨기기',
    statusAll: '전체',
    repoCount: '전체 리포지토리',
    deployed: '배포완료',
    needsFix: '수정필요',
    recent30: '최근 30일 업데이트',
    private: '비공개',
    archived: '아카이브',
    viewCard: '카드형',
    viewTable: '표형',
    sortBy: '정렬',
    category: '카테고리',
    language: '언어',
    visibility: '공개 여부',
    empty: '아직 불러온 리포지토리가 없습니다. 위에서 GitHub Username을 입력하고 “공개 리포지토리 불러오기”를 눌러보세요.',
    noResults: '조건에 맞는 리포지토리가 없습니다. 검색어나 필터를 조정해보세요.',
    loadingRepos: '리포지토리를 불러오는 중입니다.',
    syncedAt: '마지막 동기화',
    notSynced: '아직 동기화하지 않았습니다.',
    securityNotice: '공개 리포지토리는 토큰 없이 조회할 수 있습니다. 비공개 리포지토리 조회에 사용하는 토큰은 비밀번호처럼 안전하게 관리하세요.',
    recentCommits: '최근 커밋 보기',
    githubBtn: 'GitHub',
    readme: 'README',
    deployUrl: '배포 URL',
    onboardTitle: 'Chithub로 무엇을 할 수 있나요?',
    onboard1Title: 'GitHub 리포지토리 불러오기',
    onboard1Desc: 'Username 또는 개인 액세스 토큰으로 내 리포지토리를 한눈에 확인하세요.',
    onboard2Title: '앱 정보 정리하기',
    onboard2Desc: '앱 이름, 설명, 카테고리, 상태, 해시태그까지 한 곳에서 관리합니다.',
    onboard3Title: '홍보자료 생성하기',
    onboard3Desc: '한 줄 소개부터 SNS·유튜브 설명·README 초안까지 자동으로 만들 수 있습니다.',
    collapseOnboard: '안내 접기',
    expandOnboard: '안내 펼치기',
    promoH1: '홍보 자료 생성',
    promoOneLiner: '한 줄 소개',
    promoSns: 'SNS 게시글',
    promoYoutube: '유튜브 업로드 설명문',
    promoTraining: '연수 자료용 소개문',
    promoJson: '포트폴리오 JSON',
    promoReadme: 'README 초안',
    promoCsv: '홍보 자료 CSV',
    footer: 'Created by. 교육뮤지컬 꿈꾸는 치수쌤',
    secretInfoTitle: 'GitHub Token 보안 안내',
    gistSyncTitle: 'Gist 동기화',
    gistSyncDesc: 'GitHub Gist에 편집 데이터를 저장하면 어떤 기기에서도 같은 내용을 불러올 수 있습니다. 토큰에 gist 권한이 필요합니다.',
    gistIdLabel: 'Gist ID',
    gistIdPlaceholder: '업로드 후 자동으로 채워집니다',
    gistUpload: '업로드',
    gistDownload: '내려받기',
    gistLastSync: '마지막 Gist 동기화',
    gistNoToken: '토큰을 입력해야 Gist 동기화를 사용할 수 있습니다.',
    gistScopeHint: '토큰에 gist 쓰기 권한이 필요합니다 (classic: gist 범위 / fine-grained: Gists read+write).',
    gistIdHint: '다른 기기에서 이 ID를 입력하고 "내려받기"를 누르면 데이터가 동기화됩니다.',
    gistCopyId: 'ID 복사',
    autoSyncTitle: '자동 동기화',
    autoSyncDesc: '편집 내용이 변경되면 4초 뒤 자동으로 Gist에 업로드합니다. 앱을 다시 열 때도 자동으로 내려받아 항상 최신 상태를 유지합니다.',
    autoSyncEnabled: '자동 동기화를 사용 중입니다',
    autoSyncDisabled: '자동 동기화가 꺼져 있습니다',
    autoPullToast: 'Gist에서 최신 데이터를 동기화했습니다.',
    autoPushToast: 'Gist에 변경 사항을 자동 업로드했습니다.',
    dataMenu: '데이터 관리',
    dataExport: '내보내기',
    dataImport: '가져오기',
  },
  en: {
    appName: 'Chithub',
    appEn: 'Chithub',
    tagline: 'A personal dashboard to fetch GitHub repositories and craft your own web-app archive & promo materials.',
    help: 'Help',
    settings: 'Settings',
    loadPublic: 'Load public repositories',
    loadMine: 'Load my repositories',
    search: 'Search',
    filter: 'Filters',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    generatePromo: 'Generate promo',
    copy: 'Copy',
    download: 'Download',
    backup: 'JSON backup',
    restore: 'JSON restore',
    csv: 'CSV download',
    deleteToken: 'Delete saved token',
    security: 'Security',
    username: 'GitHub Username',
    token: 'Personal Access Token',
    saveTokenLabel: 'Save token in this browser',
    showToken: 'Show token',
    hideToken: 'Hide token',
    statusAll: 'All',
    repoCount: 'Total repos',
    deployed: 'Deployed',
    needsFix: 'Needs fix',
    recent30: 'Updated in 30d',
    private: 'Private',
    archived: 'Archived',
    viewCard: 'Cards',
    viewTable: 'Table',
    sortBy: 'Sort',
    category: 'Category',
    language: 'Language',
    visibility: 'Visibility',
    empty: 'No repositories loaded yet. Enter a GitHub Username above and press “Load public repositories”.',
    noResults: 'No repositories match. Try adjusting your search or filters.',
    loadingRepos: 'Loading repositories…',
    syncedAt: 'Last synced',
    notSynced: 'Not synced yet',
    securityNotice: 'Public repositories can be fetched without a token. Treat any token like a password.',
    recentCommits: 'Recent commits',
    githubBtn: 'GitHub',
    readme: 'README',
    deployUrl: 'Deploy URL',
    onboardTitle: 'What can you do with Chithub?',
    onboard1Title: 'Load GitHub repos',
    onboard1Desc: 'See all your repositories at a glance using a username or a token.',
    onboard2Title: 'Organize app info',
    onboard2Desc: 'Manage names, descriptions, categories, status and hashtags in one place.',
    onboard3Title: 'Generate promo materials',
    onboard3Desc: 'One-liners, social posts, YouTube descriptions and README drafts — automatically.',
    collapseOnboard: 'Hide tips',
    expandOnboard: 'Show tips',
    promoH1: 'Promo materials',
    promoOneLiner: 'One-liner',
    promoSns: 'Social post',
    promoYoutube: 'YouTube description',
    promoTraining: 'Training intro',
    promoJson: 'Portfolio JSON',
    promoReadme: 'README draft',
    promoCsv: 'Promo CSV',
    footer: 'Created by. 교육뮤지컬 꿈꾸는 치수쌤',
    secretInfoTitle: 'GitHub Token security notes',
    gistSyncTitle: 'Gist Sync',
    gistSyncDesc: 'Save your app metadata to a GitHub Gist to access it from any device. Requires a token with gist scope.',
    gistIdLabel: 'Gist ID',
    gistIdPlaceholder: 'Auto-filled after first upload',
    gistUpload: 'Upload',
    gistDownload: 'Download',
    gistLastSync: 'Last Gist sync',
    gistNoToken: 'Enter a token to use Gist sync.',
    gistScopeHint: 'Token needs gist write scope (classic: gist / fine-grained: Gists read+write).',
    gistIdHint: 'Enter this ID on another device and click Download to sync your data.',
    gistCopyId: 'Copy ID',
    autoSyncTitle: 'Auto sync',
    autoSyncDesc: 'Changes are uploaded to the Gist 4s after the last edit, and pulled automatically when the app opens.',
    autoSyncEnabled: 'Auto sync is on',
    autoSyncDisabled: 'Auto sync is off',
    autoPullToast: 'Synced latest data from Gist.',
    autoPushToast: 'Auto-uploaded changes to Gist.',
    dataMenu: 'Data',
    dataExport: 'Export',
    dataImport: 'Import',
  },
  ja: {
    appName: 'チットハブ',
    appEn: 'Chithub',
    tagline: 'GitHubリポジトリを取り込み、自分専用のWebアプリ・アーカイブと宣伝資料を管理するダッシュボード。',
    help: 'ヘルプ',
    settings: '設定',
    loadPublic: '公開リポジトリを取得',
    loadMine: '自分のリポジトリを取得',
    search: '検索',
    filter: 'フィルター',
    edit: '編集',
    save: '保存',
    cancel: 'キャンセル',
    generatePromo: '宣伝文を生成',
    copy: 'コピー',
    download: 'ダウンロード',
    backup: 'JSONバックアップ',
    restore: 'JSON復元',
    csv: 'CSVダウンロード',
    deleteToken: '保存済みトークンを削除',
    security: 'セキュリティ案内',
    username: 'GitHub ユーザー名',
    token: 'Personal Access Token',
    saveTokenLabel: 'このブラウザに保存',
    showToken: 'トークンを表示',
    hideToken: 'トークンを隠す',
    statusAll: 'すべて',
    repoCount: '全リポジトリ',
    deployed: 'デプロイ済み',
    needsFix: '要修正',
    recent30: '直近30日更新',
    private: '非公開',
    archived: 'アーカイブ',
    viewCard: 'カード',
    viewTable: 'テーブル',
    sortBy: '並び替え',
    category: 'カテゴリ',
    language: '言語',
    visibility: '公開状態',
    empty: 'まだリポジトリが読み込まれていません。ユーザー名を入力して「公開リポジトリを取得」を押してください。',
    noResults: '条件に合うリポジトリが見つかりません。',
    loadingRepos: 'リポジトリを読み込み中…',
    syncedAt: '最終同期',
    notSynced: '未同期',
    securityNotice: '公開リポジトリはトークン無しで取得できます。トークンはパスワードのように扱ってください。',
    recentCommits: '最近のコミット',
    githubBtn: 'GitHub',
    readme: 'README',
    deployUrl: 'デプロイURL',
    onboardTitle: 'Chithubでできること',
    onboard1Title: 'GitHubリポジトリを取得',
    onboard1Desc: 'ユーザー名またはトークンで自分のリポジトリを一覧表示。',
    onboard2Title: 'アプリ情報を整理',
    onboard2Desc: '名前・説明・カテゴリ・ステータス・ハッシュタグを一括管理。',
    onboard3Title: '宣伝資料を生成',
    onboard3Desc: 'ワンライナーからSNS・YouTube・READMEドラフトまで自動生成。',
    collapseOnboard: '案内を畳む',
    expandOnboard: '案内を表示',
    promoH1: '宣伝資料の生成',
    promoOneLiner: 'ワンライナー',
    promoSns: 'SNS投稿',
    promoYoutube: 'YouTube説明文',
    promoTraining: '研修用紹介文',
    promoJson: 'ポートフォリオJSON',
    promoReadme: 'READMEドラフト',
    promoCsv: '宣伝CSV',
    footer: 'Created by. 教育ミュージカル夢見るチスソン',
    secretInfoTitle: 'GitHubトークンのセキュリティ案内',
    gistSyncTitle: 'Gist同期',
    gistSyncDesc: 'GitHub Gistにデータを保存することで、どのデバイスからでも同じ情報を利用できます。gistスコープのトークンが必要です。',
    gistIdLabel: 'Gist ID',
    gistIdPlaceholder: 'アップロード後に自動入力されます',
    gistUpload: 'アップロード',
    gistDownload: 'ダウンロード',
    gistLastSync: '最終Gist同期',
    gistNoToken: 'Gist同期を使うにはトークンを入力してください。',
    gistScopeHint: 'トークンにgist書き込み権限が必要です（classic: gist / fine-grained: Gists read+write）。',
    gistIdHint: '別のデバイスでこのIDを入力し「ダウンロード」を押すとデータが同期されます。',
    gistCopyId: 'IDをコピー',
    autoSyncTitle: '自動同期',
    autoSyncDesc: '編集から4秒後に自動でGistへアップロードし、起動時にも自動で取得して常に最新の状態を保ちます。',
    autoSyncEnabled: '自動同期が有効です',
    autoSyncDisabled: '自動同期はオフです',
    autoPullToast: 'Gistから最新データを同期しました。',
    autoPushToast: 'Gistに変更を自動アップロードしました。',
    dataMenu: 'データ管理',
    dataExport: 'エクスポート',
    dataImport: 'インポート',
  },
};

const t = (lang, key) => I18N[lang]?.[key] ?? I18N.ko[key] ?? key;

/* ============================================================
   Helpers
============================================================ */

const defaultRepoMeta = () => ({
  appTitleKr: '',
  appTitleEn: '',
  shortDescription: '',
  longDescription: '',
  category: '',
  targetUsers: '',
  useCase: '',
  features: [],
  deploymentUrl: '',
  thumbnailUrl: '',
  status: '',
  hashtags: [],
  memo: '',
  priority: '',
  lastCheckedAt: '',
  promotionTone: '',
  updatedAt: '',
});

/* meta merger preferring newer per-key (by updatedAt / lastCheckedAt fallback) */
const metaTimestamp = (m) => {
  if (!m) return 0;
  const t = m.updatedAt || m.lastCheckedAt || '';
  if (!t) return 0;
  const n = new Date(t).getTime();
  return Number.isFinite(n) ? n : 0;
};

const mergeRepoMetaByTime = (local, remote) => {
  const result = { ...local };
  const keys = new Set([...Object.keys(local || {}), ...Object.keys(remote || {})]);
  keys.forEach((k) => {
    const l = local?.[k];
    const r = remote?.[k];
    if (!l) {
      result[k] = r;
    } else if (!r) {
      result[k] = l;
    } else {
      // remote wins on tie (both timestamp 0) — user explicitly pulling from Gist
      result[k] = metaTimestamp(r) >= metaTimestamp(l) ? r : l;
    }
  });
  return result;
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore silently */
  }
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return iso;
  }
};

const formatDateTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const daysSince = (iso) => {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
};

// 사용자가 입력한 배포 URL > repo.homepage > GitHub Pages 자동 추정
const getDeploymentUrl = (repo, meta) => {
  if (meta?.deploymentUrl) return { url: meta.deploymentUrl, source: 'manual' };
  if (repo?.homepage) return { url: repo.homepage, source: 'homepage' };
  if (repo?.has_pages) {
    const owner = repo.owner?.login || repo.full_name?.split('/')[0];
    const name = repo.name || repo.full_name?.split('/')[1];
    if (!owner || !name) return { url: '', source: '' };
    if (name.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
      return { url: `https://${owner}.github.io/`, source: 'auto' };
    }
    return { url: `https://${owner}.github.io/${name}/`, source: 'auto' };
  }
  return { url: '', source: '' };
};

const friendlyApiError = (status) => {
  switch (status) {
    case 401:
    case 403:
      return '인증에 실패했거나 권한이 부족합니다. 토큰을 다시 확인하거나 잠시 후 다시 시도해주세요.';
    case 404:
      return 'GitHub Username을 확인해주세요. 해당 사용자가 존재하지 않을 수 있습니다.';
    case 422:
      return '요청 형식이 올바르지 않습니다.';
    case 429:
      return 'GitHub API 호출 한도(rate limit)에 도달했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '리포지토리를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
};

const downloadBlob = (filename, content, mime = 'application/json') => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const csvEscape = (val) => {
  if (val == null) return '';
  const s = Array.isArray(val) ? val.join('; ') : String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
};

/* ============================================================
   GitHub API
============================================================ */

async function fetchPublicRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (!res.ok) {
    const err = new Error(friendlyApiError(res.status));
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function fetchMyRepos(token) {
  const res = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=100`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = new Error(friendlyApiError(res.status));
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function fetchRecentCommits(fullName, token) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(
    `https://api.github.com/repos/${fullName}/commits?per_page=3`,
    { headers }
  );
  if (!res.ok) {
    const err = new Error(friendlyApiError(res.status));
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/* ============================================================
   Gist API
============================================================ */

const GIST_FILENAME = 'chithub-data.json';
const GIST_DESCRIPTION = 'Chithub 동기화 데이터 (칫허브 앱 자동 생성)';

async function apiPushGist(token, gistId, payload) {
  const body = {
    description: GIST_DESCRIPTION,
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(payload, null, 2) } },
  };
  const res = await fetch(
    gistId
      ? `https://api.github.com/gists/${gistId}`
      : 'https://api.github.com/gists',
    {
      method: gistId ? 'PATCH' : 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = new Error(friendlyApiError(res.status));
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function apiPullGist(token, gistId) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers });
  if (!res.ok) {
    const err = new Error(friendlyApiError(res.status));
    err.status = res.status;
    throw err;
  }
  const gist = await res.json();
  const file = gist.files?.[GIST_FILENAME];
  if (!file) throw new Error(`Gist에서 ${GIST_FILENAME} 파일을 찾을 수 없습니다.`);
  return JSON.parse(file.content);
}

/* ============================================================
   Status / category styling
============================================================ */

const statusBadgeClass = (status) => {
  switch (status) {
    case '배포완료':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case '개발중':
      return 'bg-sky-50 text-sky-700 border border-sky-200';
    case '테스트중':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case '수정필요':
      return 'bg-red-50 text-red-700 border border-red-200';
    case '아이디어':
      return 'bg-violet-50 text-violet-700 border border-violet-200';
    case '보류':
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    case '아카이브':
      return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-200';
  }
};

/* ============================================================
   Toasts
============================================================ */

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toa) => toa.id !== id));
    }, 3200);
  }, []);
  return { toasts, push };
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-2 text-sm shadow-card border ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Promo generation
============================================================ */

const CATEGORY_EMOJI = {
  교육뮤지컬: '🎭',
  국제교류: '🌍',
  학급운영: '🏫',
  문해력: '📖',
  창작도구: '🎨',
  '평가·피드백': '📊',
  에듀테크: '🧑‍🏫',
  자료정리: '🗂️',
  기타: '✨',
};

const cleanLines = (lines) => lines.filter((l) => l != null && l !== false).join('\n');

const dedupeJoin = (arr) => Array.from(new Set(arr.filter(Boolean))).join(' ');

function buildPromo(repo, meta) {
  const title = (meta.appTitleKr || repo.name || '').trim();
  const titleEn = (meta.appTitleEn || repo.name || '').trim();
  const shortDesc = (meta.shortDescription || repo.description || '교육 활동에 활용할 수 있는 웹앱입니다.').trim();
  const longDesc = (meta.longDescription || meta.shortDescription || repo.description || '').trim() || shortDesc;
  const features = (meta.features || []).filter(Boolean);
  const targetUsers = (meta.targetUsers || '학생과 교사').trim();
  const useCase = (meta.useCase || '수업 및 연수 활동').trim();
  const category = (meta.category || '').trim();
  const status = (meta.status || '').trim();
  const tone = meta.promotionTone || '친근함';
  const url = getDeploymentUrl(repo, meta).url;
  const githubUrl = repo.html_url || '';
  const hashtagsRaw = (meta.hashtags || []).filter(Boolean);
  const hashtags = hashtagsRaw.map((h) => (h.startsWith('#') ? h : `#${h}`));
  const catTag = category ? `#${category.replace(/[·\s]/g, '')}` : '';
  const allTags = dedupeJoin([...hashtags, catTag, '#칫허브', '#Chithub']);
  const catIcon = CATEGORY_EMOJI[category] || '✨';
  const featureBullets = features.length ? features.map((f) => `• ${f}`).join('\n') : `• ${shortDesc}`;
  const featureSummary = features.length ? features.slice(0, 3).join(' · ') : shortDesc;

  /* === 1) One-liner — tone aware === */
  const oneLinerMap = {
    친근함: `${catIcon} ${title} — ${targetUsers}과(와) 함께 ${useCase}을(를) 즐겁게 만들어 주는 웹앱이에요.`,
    전문가: `${title}은(는) ${featureSummary}을(를) 기반으로 ${useCase} 활동을 효과적으로 지원하는 교육용 웹 솔루션입니다.`,
    교사용: `${title}은(는) ${targetUsers} 대상 ${useCase}을(를) 위해 만든 교실 친화형 웹앱입니다 (주요 기능: ${featureSummary}).`,
    학생용: `친구들과 함께 ${useCase}을(를) 즐겁게 해볼 수 있는 ${title}! ${featureSummary} 같은 기능이 준비돼 있어요.`,
    간결함: `${title} — ${shortDesc}`,
  };
  const oneLiner = oneLinerMap[tone] || oneLinerMap['친근함'];

  /* === 2) SNS post === */
  const snsHeaderMap = {
    친근함: `${catIcon} 새 웹앱을 소개합니다!`,
    전문가: `${catIcon} 신규 교육용 웹앱 소개`,
    교사용: `${catIcon} 교실에서 바로 활용할 수 있는 웹앱`,
    학생용: `${catIcon} 함께 써보고 싶은 새 웹앱!`,
    간결함: `${catIcon} ${title}`,
  };
  const sns = cleanLines([
    snsHeaderMap[tone] || snsHeaderMap['친근함'],
    '',
    `✨ ${title}${titleEn && titleEn !== title ? ` (${titleEn})` : ''}`,
    shortDesc,
    '',
    features.length && '🛠 핵심 기능',
    features.length && featureBullets,
    features.length && '',
    `🎯 활용: ${useCase}`,
    `👥 대상: ${targetUsers}`,
    category && `🏷 카테고리: ${category}`,
    '',
    url && `🔗 ${url}`,
    githubUrl && `💻 ${githubUrl}`,
    '',
    allTags,
  ]);

  /* === 3) YouTube description === */
  const youtube = cleanLines([
    `${title}${titleEn && titleEn !== title ? ` | ${titleEn}` : ''}`,
    '',
    '📌 소개',
    longDesc,
    '',
    features.length && '📌 주요 기능',
    features.length && features.map((f) => `- ${f}`).join('\n'),
    features.length && '',
    '📌 활용 장면',
    `${useCase} (대상: ${targetUsers})`,
    '',
    '📌 링크',
    url && `▶ 배포 페이지: ${url}`,
    githubUrl && `▶ GitHub: ${githubUrl}`,
    '',
    (category || status || repo.language) && '📌 정보',
    category && `- 카테고리: ${category}`,
    status && `- 상태: ${status}`,
    repo.language && `- 기술 스택: ${repo.language}`,
    '',
    '📌 태그',
    allTags,
    '',
    '---',
    "본 설명은 '칫허브(Chithub)'로 자동 생성되었습니다.",
  ]);

  /* === 4) Training intro (structured) === */
  const training = cleanLines([
    `[ 연수자료용 소개 · ${title} ]`,
    '',
    `▸ 앱명: ${title}${titleEn && titleEn !== title ? ` (${titleEn})` : ''}`,
    category && `▸ 카테고리: ${category}`,
    `▸ 활용 대상: ${targetUsers}`,
    `▸ 활용 장면: ${useCase}`,
    status && `▸ 개발 상태: ${status}`,
    '',
    '1) 개발 배경',
    `${title}은(는) ${targetUsers}과(와) 함께하는 ${useCase}을(를) 보다 풍부하게 만들기 위해 교사가 직접 제작한 바이브코딩 기반 웹앱입니다. ${shortDesc}`,
    '',
    '2) 주요 기능',
    featureBullets,
    '',
    '3) 사용 방법',
    url ? `• 아래 주소로 접속: ${url}` : '• 배포 페이지에 접속',
    `• ${useCase} 흐름에 맞춰 ${targetUsers}와(과) 활동을 진행`,
    '• 필요 시 하단의 GitHub 저장소에서 코드를 확인하거나 의견을 제안',
    '',
    '4) 기대 효과',
    `${targetUsers}는(은) ${featureSummary} 등을 통해 자기 주도적인 학습 경험과 즉각적인 피드백을 얻을 수 있으며, 교사는 ${useCase}을(를) 보다 의미 있게 구성할 수 있습니다.`,
    '',
    '5) 참고 링크',
    url && `• 배포 페이지: ${url}`,
    githubUrl && `• 소스코드: ${githubUrl}`,
    '',
    '※ 본 자료는 칫허브(Chithub)에서 자동 생성되었으며, 필요에 맞게 수정해 활용하세요.',
  ]);

  /* === 5) Portfolio JSON (richer) === */
  const portfolio = JSON.stringify(
    {
      title,
      englishTitle: titleEn,
      category,
      status,
      shortDescription: shortDesc,
      longDescription: longDesc,
      targetUsers,
      useCase,
      features,
      tone,
      url,
      github: githubUrl,
      language: repo.language || '',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      hashtags,
      createdAt: repo.created_at || '',
      updatedAt: repo.updated_at || '',
    },
    null,
    2
  );

  /* === 6) README (with badges + sections) === */
  const badge = (label, value, color = 'blue') =>
    value
      ? `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color})`
      : '';
  const readme = cleanLines([
    `# ${title}${titleEn && titleEn !== title ? ` · ${titleEn}` : ''}`,
    '',
    `> ${shortDesc}`,
    '',
    [
      badge('category', category || '교육', 'brightgreen'),
      badge('status', status || 'WIP', 'blue'),
      badge('lang', repo.language || '-', 'lightgrey'),
    ].filter(Boolean).join(' '),
    '',
    '## 📖 소개',
    longDesc,
    '',
    '## ✨ 주요 기능',
    features.length ? features.map((f) => `- ${f}`).join('\n') : '- 기능을 입력해주세요.',
    '',
    '## 🎯 활용 대상 · 장면',
    `- **대상**: ${targetUsers}`,
    `- **장면**: ${useCase}`,
    '',
    url ? '## 🚀 바로 사용하기' : null,
    url ? `👉 [배포 페이지 열기](${url})` : null,
    url ? '' : null,
    '## 🛠 기술 스택',
    repo.language ? `- 주 언어: ${repo.language}` : '- 기술 스택을 입력해주세요.',
    '',
    hashtags.length ? '## 🏷 태그' : null,
    hashtags.length ? hashtags.join(' ') : null,
    hashtags.length ? '' : null,
    '## 👤 제작자',
    '교육뮤지컬 꿈꾸는 치수쌤',
    '',
    githubUrl ? `🔗 GitHub: ${githubUrl}` : null,
    '',
    '---',
    "_본 README 초안은 '칫허브(Chithub)'로 자동 생성되었습니다._",
  ]);

  return { oneLiner, sns, youtube, training, portfolio, readme };
}

/* ============================================================
   App
============================================================ */

export default function App() {
  const { toasts, push } = useToasts();

  /* --- settings (language, theme, saved username, saveToken, savedToken) --- */
  const [settings, setSettings] = useState(() => {
    const saved = readJSON(STORAGE_KEYS.settings, null);
    if (saved && typeof saved === 'object') {
      return {
        language: saved.language || 'ko',
        theme: saved.theme || 'light',
        savedUsername: saved.savedUsername || '',
        saveToken: !!saved.saveToken,
        savedToken: saved.saveToken ? saved.savedToken || '' : '',
        gistId: saved.gistId || '',
        lastGistSyncAt: saved.lastGistSyncAt || '',
        autoSync: saved.autoSync === undefined ? true : !!saved.autoSync,
      };
    }
    return {
      language: 'ko',
      theme: 'light',
      savedUsername: '',
      saveToken: false,
      savedToken: '',
      gistId: '',
      lastGistSyncAt: '',
      autoSync: true,
    };
  });

  /* --- repo metadata (per repo full_name) --- */
  const [repoMeta, setRepoMeta] = useState(() =>
    readJSON(STORAGE_KEYS.repoMeta, {})
  );

  /* --- form / runtime --- */
  const [usernameInput, setUsernameInput] = useState(settings.savedUsername || '');
  const [tokenInput, setTokenInput] = useState(settings.saveToken ? settings.savedToken : '');
  const [saveTokenChecked, setSaveTokenChecked] = useState(settings.saveToken);
  const [showToken, setShowToken] = useState(false);

  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState('');
  const [commitsByRepo, setCommitsByRepo] = useState({});
  const [loadingCommitsFor, setLoadingCommitsFor] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('card');
  const [onboardCollapsed, setOnboardCollapsed] = useState(true);

  const [editingRepo, setEditingRepo] = useState(null); // full_name
  const [promoRepo, setPromoRepo] = useState(null); // full_name
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const [gistSyncing, setGistSyncing] = useState(false);

  const fileInputRef = useRef(null);

  const lang = settings.language;

  /* --- persist settings (tokens only if checkbox on) --- */
  useEffect(() => {
    const toStore = {
      language: settings.language,
      theme: settings.theme,
      savedUsername: settings.savedUsername || '',
      saveToken: settings.saveToken,
      savedToken: settings.saveToken ? settings.savedToken || '' : '',
      gistId: settings.gistId || '',
      lastGistSyncAt: settings.lastGistSyncAt || '',
      autoSync: settings.autoSync !== false,
    };
    writeJSON(STORAGE_KEYS.settings, toStore);
  }, [settings]);

  /* --- persist repo meta --- */
  useEffect(() => {
    writeJSON(STORAGE_KEYS.repoMeta, repoMeta);
  }, [repoMeta]);

  /* --- ESC to close modals --- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (editingRepo) setEditingRepo(null);
        else if (promoRepo) setPromoRepo(null);
        else if (helpOpen) setHelpOpen(false);
        else if (showSettingsPanel) setShowSettingsPanel(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editingRepo, promoRepo, helpOpen, showSettingsPanel]);

  /* --- handlers: load repos --- */
  const handleLoadPublic = async () => {
    const username = usernameInput.trim();
    if (!username) {
      push('GitHub Username을 입력해주세요.', 'error');
      return;
    }
    setLoadingRepos(true);
    try {
      const data = await fetchPublicRepos(username);
      setRepos(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date().toISOString());
      setSettings((s) => ({ ...s, savedUsername: username }));
      push(`리포지토리 ${data.length}개를 불러왔습니다.`, 'success');
      setOnboardCollapsed(true);
    } catch (err) {
      push(err?.message || friendlyApiError(0), 'error');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleLoadMine = async () => {
    if (!tokenInput) {
      push('Personal Access Token을 입력해주세요.', 'error');
      return;
    }
    setLoadingRepos(true);
    try {
      const data = await fetchMyRepos(tokenInput);
      setRepos(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date().toISOString());
      if (saveTokenChecked) {
        setSettings((s) => ({ ...s, saveToken: true, savedToken: tokenInput }));
      } else {
        setSettings((s) => ({ ...s, saveToken: false, savedToken: '' }));
      }
      push(`리포지토리 ${data.length}개를 불러왔습니다.`, 'success');
      setOnboardCollapsed(true);
    } catch (err) {
      push(err?.message || friendlyApiError(0), 'error');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleDeleteSavedToken = () => {
    setTokenInput('');
    setSaveTokenChecked(false);
    setSettings((s) => ({ ...s, saveToken: false, savedToken: '' }));
    push('저장된 토큰을 삭제했습니다.', 'success');
  };

  const handleLoadCommits = async (fullName) => {
    setLoadingCommitsFor(fullName);
    try {
      const data = await fetchRecentCommits(
        fullName,
        settings.saveToken ? settings.savedToken : tokenInput || ''
      );
      setCommitsByRepo((prev) => ({ ...prev, [fullName]: data }));
    } catch (err) {
      push(err?.message || friendlyApiError(0), 'error');
    } finally {
      setLoadingCommitsFor('');
    }
  };

  /* --- metadata helpers --- */
  const getMeta = useCallback(
    (fullName) => repoMeta[fullName] || defaultRepoMeta(),
    [repoMeta]
  );

  const updateMeta = (fullName, patch) => {
    setRepoMeta((prev) => ({
      ...prev,
      [fullName]: {
        ...defaultRepoMeta(),
        ...(prev[fullName] || {}),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  /* --- filtering / sorting --- */
  const merged = useMemo(() => {
    return repos.map((repo) => ({
      repo,
      meta: getMeta(repo.full_name),
    }));
  }, [repos, getMeta]);

  const languages = useMemo(() => {
    const set = new Set();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [repos]);

  const categories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    Object.values(repoMeta).forEach((m) => {
      if (m?.category) set.add(m.category);
    });
    return Array.from(set);
  }, [repoMeta]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let arr = merged.filter(({ repo, meta }) => {
      if (filterCategory && meta.category !== filterCategory) return false;
      if (filterStatus && meta.status !== filterStatus) return false;
      if (filterLanguage && repo.language !== filterLanguage) return false;
      if (filterVisibility === 'public' && repo.private) return false;
      if (filterVisibility === 'private' && !repo.private) return false;
      if (!term) return true;
      const hay = [
        repo.name,
        repo.full_name,
        repo.description,
        repo.language,
        meta.appTitleKr,
        meta.appTitleEn,
        meta.shortDescription,
        meta.longDescription,
        meta.memo,
        (meta.hashtags || []).join(' '),
        (meta.features || []).join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });

    const statusOrder = STATUS_OPTIONS.reduce((acc, s, i) => ({ ...acc, [s]: i }), {});
    const priorityOrder = { 높음: 0, 보통: 1, 낮음: 2, '': 3 };

    arr = arr.slice().sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.repo.name.localeCompare(b.repo.name);
        case 'stars':
          return (b.repo.stargazers_count || 0) - (a.repo.stargazers_count || 0);
        case 'status':
          return (statusOrder[a.meta.status] ?? 99) - (statusOrder[b.meta.status] ?? 99);
        case 'priority':
          return (priorityOrder[a.meta.priority] ?? 9) - (priorityOrder[b.meta.priority] ?? 9);
        case 'createdDesc':
          return new Date(b.repo.created_at || 0) - new Date(a.repo.created_at || 0);
        case 'createdAsc':
          return new Date(a.repo.created_at || 0) - new Date(b.repo.created_at || 0);
        case 'updated':
        default:
          return new Date(b.repo.updated_at || 0) - new Date(a.repo.updated_at || 0);
      }
    });

    return arr;
  }, [merged, searchTerm, filterCategory, filterStatus, filterLanguage, filterVisibility, sortBy]);

  /* --- summary counts --- */
  const summary = useMemo(() => {
    let deployed = 0;
    let needsFix = 0;
    let recent30 = 0;
    let priv = 0;
    let arch = 0;
    merged.forEach(({ repo, meta }) => {
      if (meta.status === '배포완료') deployed += 1;
      if (meta.status === '수정필요') needsFix += 1;
      if (daysSince(repo.updated_at) <= 30) recent30 += 1;
      if (repo.private) priv += 1;
      if (repo.archived) arch += 1;
    });
    return { total: repos.length, deployed, needsFix, recent30, private: priv, archived: arch };
  }, [merged, repos.length]);

  /* --- backup / restore --- */
  const exportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'chithub',
      version: 1,
      settings: {
        language: settings.language,
        theme: settings.theme,
        savedUsername: settings.savedUsername || '',
        saveToken: false,
        savedToken: '',
      },
      repoMeta,
    };
    downloadBlob(`chithub-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2));
    push('JSON 백업을 내려받았습니다. (토큰은 포함되지 않습니다)', 'success');
  };

  const importBackup = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') throw new Error('형식이 올바르지 않습니다.');
        if (data.repoMeta && typeof data.repoMeta === 'object') {
          setRepoMeta(data.repoMeta);
        }
        if (data.settings && typeof data.settings === 'object') {
          setSettings((s) => ({
            ...s,
            language: data.settings.language || s.language,
            theme: data.settings.theme || s.theme,
            savedUsername: data.settings.savedUsername || s.savedUsername,
          }));
        }
        push('백업을 복원했습니다.', 'success');
      } catch {
        push('JSON 파일을 읽지 못했습니다. 형식을 확인해주세요.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const exportCsv = () => {
    const rows = [
      ['title', 'englishTitle', 'repository', 'category', 'status', 'description', 'features', 'deploymentUrl', 'githubUrl', 'hashtags', 'memo', 'updatedAt'],
      ...filtered.map(({ repo, meta }) => [
        meta.appTitleKr || repo.name,
        meta.appTitleEn || '',
        repo.full_name,
        meta.category || '',
        meta.status || '',
        meta.shortDescription || repo.description || '',
        meta.features || [],
        getDeploymentUrl(repo, meta).url,
        repo.html_url || '',
        meta.hashtags || [],
        meta.memo || '',
        repo.updated_at || '',
      ]),
    ];
    const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
    downloadBlob(`chithub-list-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
    push('CSV를 내려받았습니다.', 'success');
  };

  const exportPromoCsv = () => {
    const rows = [
      ['repository', 'oneLiner', 'sns', 'youtube', 'training', 'readme'],
      ...filtered.map(({ repo, meta }) => {
        const promo = buildPromo(repo, meta);
        return [repo.full_name, promo.oneLiner, promo.sns, promo.youtube, promo.training, promo.readme];
      }),
    ];
    const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
    downloadBlob(`chithub-promo-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
    push('홍보 자료 CSV를 내려받았습니다.', 'success');
  };

  /* --- gist sync --- */
  const effectiveToken = tokenInput || (settings.saveToken ? settings.savedToken : '');

  const pullInProgressRef = useRef(false);
  const lastPushedSnapshotRef = useRef(null);
  const autoPullDoneRef = useRef(false);
  const pushTimerRef = useRef(null);
  const repoMetaRef = useRef(repoMeta);
  useEffect(() => {
    repoMetaRef.current = repoMeta;
  }, [repoMeta]);

  const handlePushToGist = useCallback(async (silent = false) => {
    if (!effectiveToken) {
      if (!silent) push('토큰을 입력해야 Gist에 업로드할 수 있습니다.', 'error');
      return;
    }
    setGistSyncing(true);
    try {
      const metaSnapshot = repoMetaRef.current;
      const payload = {
        exportedAt: new Date().toISOString(),
        app: 'chithub',
        version: 2,
        settings: {
          language: settings.language,
          savedUsername: settings.savedUsername || '',
          saveToken: false,
          savedToken: '',
          gistId: settings.gistId || '',
        },
        repoMeta: metaSnapshot,
      };
      const gist = await apiPushGist(effectiveToken, settings.gistId || '', payload);
      lastPushedSnapshotRef.current = JSON.stringify(metaSnapshot);
      setSettings((s) => ({
        ...s,
        gistId: gist.id,
        lastGistSyncAt: new Date().toISOString(),
      }));
      if (silent) {
        push(t(settings.language, 'autoPushToast'), 'success');
      } else {
        push(`Gist에 업로드했습니다. ID: ${gist.id}`, 'success');
      }
    } catch (err) {
      push(err?.message || 'Gist 업로드 중 오류가 발생했습니다.', 'error');
    } finally {
      setGistSyncing(false);
    }
  }, [effectiveToken, settings.gistId, settings.language, settings.savedUsername, push]);

  const handlePullFromGist = useCallback(async (gistId, { silent = false } = {}) => {
    if (!gistId) {
      if (!silent) push('Gist ID를 입력해주세요.', 'error');
      return;
    }
    setGistSyncing(true);
    pullInProgressRef.current = true;
    autoPullDoneRef.current = true;
    try {
      const data = await apiPullGist(effectiveToken, gistId);
      if (data.repoMeta && typeof data.repoMeta === 'object') {
        const merged = mergeRepoMetaByTime(repoMetaRef.current, data.repoMeta);
        setRepoMeta(merged);
        repoMetaRef.current = merged;
        lastPushedSnapshotRef.current = JSON.stringify(merged);
      } else {
        lastPushedSnapshotRef.current = JSON.stringify(repoMetaRef.current);
      }
      setSettings((s) => ({
        ...s,
        gistId,
        lastGistSyncAt: new Date().toISOString(),
        ...(data.settings?.language ? { language: data.settings.language } : {}),
        ...(data.settings?.savedUsername ? { savedUsername: data.settings.savedUsername } : {}),
      }));
      const successMsg = silent ? t(settings.language, 'autoPullToast') : 'Gist에서 데이터를 내려받았습니다.';
      push(successMsg, 'success');

      // If repos aren't loaded yet but we have a savedUsername from the pulled settings,
      // automatically fetch repos so the synced metadata is immediately visible.
      const pulledUsername = data.settings?.savedUsername;
      if (!silent && pulledUsername) {
        // reuse the existing loadPublic logic via a lightweight fetch
        try {
          setLoadingRepos(true);
          const repoData = await fetchPublicRepos(pulledUsername);
          setRepos(Array.isArray(repoData) ? repoData : []);
          setLastSyncedAt(new Date().toISOString());
          push(`리포지토리 ${repoData.length}개도 함께 불러왔습니다.`, 'success');
        } catch {
          push('리포지토리 자동 로드에 실패했습니다. 상단에서 직접 불러와주세요.', 'error');
        } finally {
          setLoadingRepos(false);
        }
      }
    } catch (err) {
      if (!silent) push(err?.message || 'Gist 내려받기 중 오류가 발생했습니다.', 'error');
    } finally {
      setGistSyncing(false);
      // release pull flag on next tick so debounced push effect ignores the merge update
      setTimeout(() => { pullInProgressRef.current = false; }, 0);
    }
  }, [effectiveToken, settings.language, push]);

  /* auto-pull once on mount when gistId + token + autoSync are all available */
  useEffect(() => {
    if (autoPullDoneRef.current) return;
    if (!settings.autoSync) return;
    if (!settings.gistId || !effectiveToken) return;
    autoPullDoneRef.current = true;
    handlePullFromGist(settings.gistId, { silent: true });
  }, [settings.autoSync, settings.gistId, effectiveToken, handlePullFromGist]);

  /* debounced auto-push when repoMeta changes (only after a successful sync baseline exists) */
  useEffect(() => {
    if (!settings.autoSync) return;
    if (!settings.gistId || !effectiveToken) return;
    if (pullInProgressRef.current) return;
    if (lastPushedSnapshotRef.current === null) return; // require initial sync first
    const snapshot = JSON.stringify(repoMeta);
    if (snapshot === lastPushedSnapshotRef.current) return;
    clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(() => {
      handlePushToGist(true);
    }, 4000);
    return () => clearTimeout(pushTimerRef.current);
  }, [repoMeta, settings.autoSync, settings.gistId, effectiveToken, handlePushToGist]);

  /* --- editing repo data --- */
  const currentEditingMeta = editingRepo ? getMeta(editingRepo) : null;
  const currentEditingRepo = editingRepo ? repos.find((r) => r.full_name === editingRepo) : null;
  const currentPromoRepo = promoRepo ? repos.find((r) => r.full_name === promoRepo) : null;
  const currentPromoMeta = promoRepo ? getMeta(promoRepo) : null;

  return (
    <div className="min-h-screen text-slate-900">
      <ToastStack toasts={toasts} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white grid place-items-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold leading-tight">
                {t(lang, 'appName')} <span className="text-slate-400 font-medium">· {t(lang, 'appEn')}</span>
              </div>
              <div className="text-xs text-slate-500 hidden sm:block">{t(lang, 'tagline')}</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <div className="relative">
              <label htmlFor="lang-select" className="sr-only">Language</label>
              <select
                id="lang-select"
                value={lang}
                onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
                className="input pl-8 py-1.5 text-sm w-auto"
                aria-label="Language"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
              <Languages className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button className="btn-ghost" onClick={() => setHelpOpen(true)} aria-label={t(lang, 'help')}>
              <HelpCircle className="w-4 h-4" /> <span className="hidden sm:inline">{t(lang, 'help')}</span>
            </button>
            <button className="btn-ghost" onClick={() => setShowSettingsPanel(true)} aria-label={t(lang, 'settings')}>
              <Settings className="w-4 h-4" /> <span className="hidden sm:inline">{t(lang, 'settings')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Onboarding cards */}
        {!onboardCollapsed && (
          <section className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">{t(lang, 'onboardTitle')}</h2>
              <button className="btn-ghost text-sm" onClick={() => setOnboardCollapsed(true)}>
                {t(lang, 'collapseOnboard')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <OnboardCard
                icon={<Github className="w-5 h-5" />}
                title={t(lang, 'onboard1Title')}
                desc={t(lang, 'onboard1Desc')}
                step="01"
              />
              <OnboardCard
                icon={<Edit3 className="w-5 h-5" />}
                title={t(lang, 'onboard2Title')}
                desc={t(lang, 'onboard2Desc')}
                step="02"
              />
              <OnboardCard
                icon={<Sparkles className="w-5 h-5" />}
                title={t(lang, 'onboard3Title')}
                desc={t(lang, 'onboard3Desc')}
                step="03"
              />
            </div>
          </section>
        )}
        {onboardCollapsed && (
          <div className="text-right">
            <button className="text-sm text-brand-700 hover:underline" onClick={() => setOnboardCollapsed(false)}>
              {t(lang, 'expandOnboard')}
            </button>
          </div>
        )}

        {/* Connect panel */}
        <section className="card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mb-3">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub 연결
            </h2>
            <div className="text-xs text-slate-500">
              {lastSyncedAt ? `${t(lang, 'syncedAt')}: ${formatDateTime(lastSyncedAt)}` : t(lang, 'notSynced')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="label">{t(lang, 'username')}</label>
              <input
                id="username"
                className="input"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="GitHub Username"
                aria-describedby="username-desc"
              />
              <p id="username-desc" className="mt-1 text-xs text-slate-500">
                GitHub 사용자명을 입력하면 공개 리포지토리를 불러올 수 있습니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="btn-primary"
                  onClick={handleLoadPublic}
                  disabled={loadingRepos}
                >
                  {loadingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                  {t(lang, 'loadPublic')}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="token" className="label">
                {t(lang, 'token')} <span className="text-xs font-normal text-slate-500">(비공개 리포지토리 조회 시 선택 입력)</span>
              </label>
              <div className="relative">
                <input
                  id="token"
                  type={showToken ? 'text' : 'password'}
                  className="input pr-10"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxx"
                  autoComplete="off"
                  spellCheck="false"
                  aria-describedby="token-desc"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800"
                  onClick={() => setShowToken((v) => !v)}
                  aria-label={showToken ? t(lang, 'hideToken') : t(lang, 'showToken')}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p id="token-desc" className="mt-1 text-xs text-slate-500 flex items-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-600" />
                <span>토큰은 기본적으로 저장되지 않으며, 새로고침하면 사라집니다.</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="save-token"
                  type="checkbox"
                  checked={saveTokenChecked}
                  onChange={(e) => setSaveTokenChecked(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <label htmlFor="save-token" className="text-sm text-slate-700">
                  {t(lang, 'saveTokenLabel')} <span className="text-xs text-amber-700">(개인 기기에서만 사용하세요)</span>
                </label>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="btn-secondary"
                  onClick={handleLoadMine}
                  disabled={loadingRepos}
                >
                  {loadingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                  {t(lang, 'loadMine')}
                </button>
                <button className="btn-danger" onClick={handleDeleteSavedToken}>
                  <Trash2 className="w-4 h-4" /> {t(lang, 'deleteToken')}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 flex gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t(lang, 'securityNotice')}</span>
          </div>
        </section>

        {/* Summary cards */}
        {repos.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label={t(lang, 'repoCount')} value={summary.total} icon={<Github className="w-4 h-4" />} />
            <StatCard label={t(lang, 'deployed')} value={summary.deployed} icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} />
            <StatCard label={t(lang, 'needsFix')} value={summary.needsFix} icon={<CircleAlert className="w-4 h-4 text-red-600" />} />
            <StatCard label={t(lang, 'recent30')} value={summary.recent30} icon={<GitCommit className="w-4 h-4 text-brand-600" />} />
            <StatCard label={t(lang, 'private')} value={summary.private} icon={<Lock className="w-4 h-4 text-slate-700" />} />
            <StatCard label={t(lang, 'archived')} value={summary.archived} icon={<Archive className="w-4 h-4 text-zinc-500" />} />
          </section>
        )}

        {/* Filters / view controls */}
        {repos.length > 0 && (
          <section className="card p-3 sm:p-4">
            {/* 1행: 검색 + 보기 모드 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <label htmlFor="search" className="sr-only">{t(lang, 'search')}</label>
                <input
                  id="search"
                  className="input pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`${t(lang, 'search')}…`}
                />
              </div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 self-stretch sm:self-auto">
                <button
                  className={`btn flex-1 sm:flex-initial ${
                    viewMode === 'card'
                      ? 'bg-white shadow-sm text-slate-900'
                      : 'text-slate-500'
                  }`}
                  onClick={() => setViewMode('card')}
                  aria-pressed={viewMode === 'card'}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden xs:inline sm:inline">{t(lang, 'viewCard')}</span>
                </button>
                <button
                  className={`btn flex-1 sm:flex-initial ${
                    viewMode === 'table'
                      ? 'bg-white shadow-sm text-slate-900'
                      : 'text-slate-500'
                  }`}
                  onClick={() => setViewMode('table')}
                  aria-pressed={viewMode === 'table'}
                >
                  <TableIcon className="w-4 h-4" />
                  <span className="hidden xs:inline sm:inline">{t(lang, 'viewTable')}</span>
                </button>
              </div>
            </div>

            {/* 2행: 필터 */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <SelectField
                label={t(lang, 'category')}
                value={filterCategory}
                onChange={setFilterCategory}
                options={['', ...categories]}
                placeholder={t(lang, 'statusAll')}
              />
              <SelectField
                label="상태"
                value={filterStatus}
                onChange={setFilterStatus}
                options={['', ...STATUS_OPTIONS]}
                placeholder={t(lang, 'statusAll')}
              />
              <SelectField
                label={t(lang, 'language')}
                value={filterLanguage}
                onChange={setFilterLanguage}
                options={['', ...languages]}
                placeholder={t(lang, 'statusAll')}
              />
              <SelectField
                label={t(lang, 'visibility')}
                value={filterVisibility}
                onChange={setFilterVisibility}
                options={['', 'public', 'private']}
                placeholder={t(lang, 'statusAll')}
                labelMap={{ public: '공개', private: '비공개' }}
              />
              <div>
                <label className="label sr-only" htmlFor="sort">{t(lang, 'sortBy')}</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input py-1.5 w-auto"
                  aria-label={t(lang, 'sortBy')}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label[lang] || opt.label.ko}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3행: 데이터 관리 + 결과 수 */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <DropdownMenu
                label={t(lang, 'dataMenu')}
                icon={<MoreHorizontal className="w-3.5 h-3.5" />}
              >
                <MenuItem
                  icon={<Download className="w-4 h-4" />}
                  label={t(lang, 'backup')}
                  hint="현재 데이터를 JSON 파일로 저장"
                  onClick={exportBackup}
                />
                <MenuItem
                  icon={<Upload className="w-4 h-4" />}
                  label={t(lang, 'restore')}
                  hint="JSON 백업 파일에서 복원"
                  onClick={() => fileInputRef.current?.click()}
                />
                <div className="my-1 border-t border-slate-100" />
                <MenuItem
                  icon={<FileSpreadsheet className="w-4 h-4" />}
                  label="CSV 다운로드"
                  hint="앱 목록을 표 형식으로 저장"
                  onClick={exportCsv}
                />
                <MenuItem
                  icon={<Megaphone className="w-4 h-4" />}
                  label={t(lang, 'promoCsv')}
                  hint="홍보 문구를 일괄 다운로드"
                  onClick={exportPromoCsv}
                />
              </DropdownMenu>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importBackup(file);
                  e.target.value = '';
                }}
                className="hidden"
              />
              {settings.autoSync && settings.gistId && effectiveToken && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <Cloud className="w-3 h-3" /> 자동 동기화
                </span>
              )}
              <span className="text-slate-500 ml-auto whitespace-nowrap">
                결과 <strong className="text-slate-700">{filtered.length}</strong>개
              </span>
            </div>
          </section>
        )}

        {/* List */}
        <section>
          {loadingRepos && (
            <div className="card p-6 flex items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> {t(lang, 'loadingRepos')}
            </div>
          )}

          {!loadingRepos && repos.length === 0 && (
            <div className="card p-8 text-center text-slate-600">
              <Info className="w-6 h-6 mx-auto text-brand-600 mb-2" />
              <p>{t(lang, 'empty')}</p>
            </div>
          )}

          {!loadingRepos && repos.length > 0 && filtered.length === 0 && (
            <div className="card p-8 text-center text-slate-600">
              <Search className="w-6 h-6 mx-auto text-slate-400 mb-2" />
              <p>{t(lang, 'noResults')}</p>
            </div>
          )}

          {!loadingRepos && filtered.length > 0 && viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(({ repo, meta }) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  meta={meta}
                  lang={lang}
                  onEdit={() => setEditingRepo(repo.full_name)}
                  onPromo={() => setPromoRepo(repo.full_name)}
                  onLoadCommits={() => handleLoadCommits(repo.full_name)}
                  commits={commitsByRepo[repo.full_name]}
                  loadingCommits={loadingCommitsFor === repo.full_name}
                />
              ))}
            </div>
          )}

          {!loadingRepos && filtered.length > 0 && viewMode === 'table' && (
            <div className="card overflow-x-auto scroll-shadow">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="sticky top-0 z-10 text-left text-xs uppercase tracking-wide text-slate-500 bg-slate-100/95 backdrop-blur shadow-[inset_0_-1px_0_rgb(226,232,240)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">앱 / 리포지토리</th>
                    <th className="px-3 py-3 font-semibold">상태</th>
                    <th className="px-3 py-3 font-semibold">카테고리</th>
                    <th className="px-3 py-3 font-semibold">언어</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">생성 / 수정</th>
                    <th className="px-3 py-3 font-semibold whitespace-nowrap">활동</th>
                    <th className="px-3 py-3 font-semibold">메모</th>
                    <th className="px-3 py-3 font-semibold text-center">링크</th>
                    <th className="px-3 py-3 font-semibold text-right">동작</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(({ repo, meta }, idx) => {
                    const d = getDeploymentUrl(repo, meta);
                    return (
                      <tr
                        key={repo.id}
                        className={`border-t border-slate-100 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        } hover:bg-brand-50/40 transition-colors`}
                      >
                        <td className="px-4 py-3 max-w-[260px]">
                          <div className="font-semibold text-slate-900 truncate">
                            {meta.appTitleKr || repo.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate font-mono flex items-center gap-1">
                            {repo.private && <Lock className="w-3 h-3 inline shrink-0" aria-label="비공개" />}
                            {repo.archived && <Archive className="w-3 h-3 inline shrink-0" aria-label="아카이브" />}
                            <span className="truncate">{repo.full_name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          {meta.status ? (
                            <span className={`badge ${statusBadgeClass(meta.status)}`}>{meta.status}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {meta.category ? (
                            <span className="badge bg-brand-50 text-brand-700 border border-brand-200">
                              {meta.category}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {repo.language ? (
                            <span className="badge bg-slate-100 text-slate-700">{repo.language}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-600 leading-tight">
                          <div title="최초 생성일">📅 {formatDate(repo.created_at)}</div>
                          <div className="text-slate-500" title="최종 수정일">
                            ✏️ {formatDate(repo.updated_at)}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1" title="Stars">
                            <Star className="w-3 h-3" /> {repo.stargazers_count || 0}
                          </span>
                          <span className="inline-flex items-center gap-1 ml-2" title="Forks">
                            <GitFork className="w-3 h-3" /> {repo.forks_count || 0}
                          </span>
                        </td>
                        <td className="px-3 py-3 max-w-[200px]">
                          {meta.memo ? (
                            <div
                              className="text-slate-600 line-clamp-2 text-xs leading-snug"
                              title={meta.memo}
                            >
                              {meta.memo}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 inline-flex"
                              title="GitHub로 이동"
                              aria-label="GitHub로 이동"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                            {d.url ? (
                              <a
                                href={d.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-700 inline-flex relative"
                                title={
                                  d.source === 'auto'
                                    ? `GitHub Pages 자동 감지: ${d.url}`
                                    : d.url
                                }
                                aria-label="배포 URL 열기"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {d.source === 'auto' && (
                                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                )}
                              </a>
                            ) : (
                              <span className="p-1.5 inline-flex text-slate-300">
                                <ExternalLink className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 inline-flex"
                              onClick={() => setEditingRepo(repo.full_name)}
                              title="편집"
                              aria-label="편집"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-brand-50 text-brand-700 inline-flex"
                              onClick={() => setPromoRepo(repo.full_name)}
                              title="홍보문 생성"
                              aria-label="홍보문 생성"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-600 flex flex-wrap items-center gap-2">
          <a
            href="https://litt.ly/chichiboo"
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-brand-700 font-semibold"
          >
            {t(lang, 'footer')}
          </a>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{t(lang, 'appName')} · {t(lang, 'appEn')}</span>
        </div>
      </footer>

      {/* Edit modal */}
      {editingRepo && currentEditingRepo && (
        <EditModal
          repo={currentEditingRepo}
          meta={currentEditingMeta}
          categories={categories}
          lang={lang}
          onClose={() => setEditingRepo(null)}
          onSave={(patch) => {
            updateMeta(editingRepo, { ...patch, lastCheckedAt: new Date().toISOString() });
            setEditingRepo(null);
            push('저장했습니다.', 'success');
          }}
          onOpenPromo={() => {
            setPromoRepo(editingRepo);
            setEditingRepo(null);
          }}
        />
      )}

      {/* Promo modal */}
      {promoRepo && currentPromoRepo && (
        <PromoModal
          repo={currentPromoRepo}
          meta={currentPromoMeta}
          lang={lang}
          onClose={() => setPromoRepo(null)}
          onCopy={async (text) => {
            const ok = await copyToClipboard(text);
            push(ok ? '클립보드에 복사했습니다.' : '복사에 실패했습니다.', ok ? 'success' : 'error');
          }}
          onDownload={(filename, content, mime) => {
            downloadBlob(filename, content, mime);
            push(`${filename} 파일을 내려받았습니다.`, 'success');
          }}
        />
      )}

      {/* Help modal */}
      {helpOpen && <HelpModal lang={lang} onClose={() => setHelpOpen(false)} />}

      {/* Settings modal */}
      {showSettingsPanel && (
        <SettingsModal
          lang={lang}
          settings={settings}
          onChangeLang={(l) => setSettings((s) => ({ ...s, language: l }))}
          onResetUsername={() => {
            setSettings((s) => ({ ...s, savedUsername: '' }));
            setUsernameInput('');
            push('저장된 Username을 비웠습니다.', 'success');
          }}
          onDeleteToken={handleDeleteSavedToken}
          onClose={() => setShowSettingsPanel(false)}
          gistSyncing={gistSyncing}
          hasToken={!!effectiveToken}
          onPushGist={() => handlePushToGist(false)}
          onPullGist={(id) => handlePullFromGist(id)}
          onToggleAutoSync={(v) => setSettings((s) => ({ ...s, autoSync: !!v }))}
          onCopyGistId={async (id) => {
            const ok = await copyToClipboard(id);
            push(ok ? 'Gist ID를 복사했습니다.' : '복사에 실패했습니다.', ok ? 'success' : 'error');
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   Small components
============================================================ */

function OnboardCard({ icon, title, desc, step }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2 text-brand-700 font-semibold text-sm">
        <span className="w-7 h-7 rounded-md bg-brand-600 text-white grid place-items-center">{icon}</span>
        <span className="text-xs text-slate-500">{step}</span>
      </div>
      <div className="mt-2 font-semibold text-slate-900">{title}</div>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function DropdownMenu({ label, icon, children, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="btn-secondary text-xs py-1.5"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {icon}
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-30 mt-1.5 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-card py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, hint }) {
  return (
    <button
      type="button"
      role="menuitem"
      className="w-full text-left flex items-start gap-2.5 px-3 py-2 hover:bg-slate-50"
      onClick={onClick}
    >
      <span className="mt-0.5 text-slate-500 shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {hint && <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>}
      </span>
    </button>
  );
}

function SelectField({ label, value, onChange, options, placeholder, labelMap }) {
  const id = `select-${label}`;
  return (
    <div>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input py-1.5 w-auto"
        aria-label={label}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt === '' ? `${label}: ${placeholder}` : labelMap?.[opt] || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Modal({ title, onClose, children, footer, wide }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm grid place-items-end sm:place-items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${wide ? 'sm:max-w-4xl' : 'sm:max-w-2xl'} bg-white rounded-t-2xl sm:rounded-2xl shadow-card max-h-[92vh] flex flex-col`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 id="modal-title" className="font-bold text-slate-900">{title}</h3>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
}

/* ============================================================
   RepoCard
============================================================ */

function RepoCard({ repo, meta, lang, onEdit, onPromo, onLoadCommits, commits, loadingCommits }) {
  const deploy = getDeploymentUrl(repo, meta);

  return (
    <article className="card p-4 sm:p-5 flex flex-col h-full">
      {/* 리포지토리 경로 + 공개/아카이브 표시 */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
        <Github className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate font-mono">{repo.full_name}</span>
        {repo.private && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-label="비공개" />}
        {repo.archived && <Archive className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-label="아카이브" />}
      </div>

      {/* 앱 이름 */}
      <h3 className="text-base sm:text-lg font-bold leading-snug mt-1.5 break-words">
        {meta.appTitleKr || repo.name}
      </h3>
      {meta.appTitleEn && (
        <div className="text-xs text-slate-500 mt-0.5 break-words">{meta.appTitleEn}</div>
      )}

      {/* 상태 / 카테고리 / 언어 배지 */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {meta.status && <span className={`badge ${statusBadgeClass(meta.status)}`}>{meta.status}</span>}
        {meta.category && (
          <span className="badge bg-brand-50 text-brand-700 border border-brand-200">{meta.category}</span>
        )}
        {repo.language && <span className="badge bg-slate-100 text-slate-700">{repo.language}</span>}
      </div>

      {/* 설명 */}
      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[2.5em]">
        {meta.shortDescription || repo.description || (
          <span className="text-slate-400 italic">설명이 없습니다.</span>
        )}
      </p>

      {/* Stats + 날짜 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1" title="Stars">
          <Star className="w-3.5 h-3.5" /> {repo.stargazers_count || 0}
        </span>
        <span className="flex items-center gap-1" title="Forks">
          <GitFork className="w-3.5 h-3.5" /> {repo.forks_count || 0}
        </span>
        <span className="flex items-center gap-1" title="Open issues">
          <CircleAlert className="w-3.5 h-3.5" /> {repo.open_issues_count || 0}
        </span>
        <span className="ml-auto text-slate-400" title="최초 생성일 / 최종 수정일">
          📅 {formatDate(repo.created_at)} · ✏️ {formatDate(repo.updated_at)}
        </span>
      </div>

      {/* 해시태그 */}
      {(meta.hashtags || []).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {meta.hashtags.slice(0, 6).map((h, idx) => (
            <span
              key={idx}
              className="badge bg-slate-50 text-slate-600 border border-slate-200"
            >
              #{h.replace(/^#/, '')}
            </span>
          ))}
          {meta.hashtags.length > 6 && (
            <span className="text-xs text-slate-400 self-center">
              +{meta.hashtags.length - 6}
            </span>
          )}
        </div>
      )}

      {/* 메모 (있을 때만, 컴팩트하게) */}
      {meta.memo && (
        <div
          className="mt-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs p-2 line-clamp-2"
          title={meta.memo}
        >
          📝 {meta.memo}
        </div>
      )}

      {/* 최근 커밋 패널 */}
      {commits && (
        <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-700 space-y-1">
          {commits.length === 0 && <div className="text-slate-500">최근 커밋이 없습니다.</div>}
          {commits.map((c) => (
            <div key={c.sha} className="flex items-start gap-2">
              <code className="text-slate-500 shrink-0">{c.sha?.slice(0, 7)}</code>
              <a
                href={c.html_url}
                target="_blank"
                rel="noreferrer"
                className="hover:underline truncate"
                title={c.commit?.message}
              >
                {c.commit?.message?.split('\n')[0] || '(no message)'}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 액션 영역: 카드 하단 고정 */}
      <div className="mt-auto pt-3 border-t border-slate-100">
        {/* primary actions */}
        <div className="flex gap-2">
          <button
            className="btn-primary text-xs sm:text-sm py-2 flex-1"
            onClick={onEdit}
          >
            <Edit3 className="w-3.5 h-3.5" /> {t(lang, 'edit')}
          </button>
          <button
            className="btn-primary text-xs sm:text-sm py-2 flex-1"
            onClick={onPromo}
          >
            <Sparkles className="w-3.5 h-3.5" /> {t(lang, 'generatePromo')}
          </button>
        </div>

        {/* secondary links: GitHub / 배포 / 최근 커밋 */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <a
            className="text-slate-600 hover:text-brand-700 inline-flex items-center gap-1"
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
          {deploy.url && (
            <a
              className="text-slate-600 hover:text-brand-700 inline-flex items-center gap-1 max-w-[160px]"
              href={deploy.url}
              target="_blank"
              rel="noreferrer"
              title={
                deploy.source === 'auto'
                  ? `GitHub Pages 자동 감지: ${deploy.url}`
                  : deploy.url
              }
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t(lang, 'deployUrl')}</span>
              {deploy.source === 'auto' && (
                <span className="text-[10px] text-amber-600 font-semibold shrink-0">·자동</span>
              )}
            </a>
          )}
          <button
            className="ml-auto text-slate-500 hover:text-brand-700 inline-flex items-center gap-1 disabled:opacity-50"
            onClick={onLoadCommits}
            disabled={loadingCommits}
          >
            {loadingCommits ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <GitCommit className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{t(lang, 'recentCommits')}</span>
            <span className="sm:hidden">커밋</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   EditModal
============================================================ */

function EditModal({ repo, meta, categories, lang, onClose, onSave, onOpenPromo }) {
  const [form, setForm] = useState(() => ({
    ...defaultRepoMeta(),
    ...meta,
    features: Array.isArray(meta?.features) ? meta.features : [],
    hashtags: Array.isArray(meta?.hashtags) ? meta.hashtags : [],
  }));
  const [featuresInput, setFeaturesInput] = useState((meta?.features || []).join(', '));
  const [hashtagsInput, setHashtagsInput] = useState((meta?.hashtags || []).join(', '));

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    const features = featuresInput
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const hashtags = hashtagsInput
      .split(/[,\s]/)
      .map((s) => s.trim().replace(/^#/, ''))
      .filter(Boolean);
    onSave({ ...form, features, hashtags });
  };

  return (
    <Modal
      title={`편집 · ${repo.full_name}`}
      onClose={onClose}
      wide
      footer={
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <button className="btn-ghost" onClick={onOpenPromo}>
            <Sparkles className="w-4 h-4" /> {t(lang, 'generatePromo')}
          </button>
          <div className="flex gap-2 ml-auto">
            <button className="btn-secondary" onClick={onClose}>{t(lang, 'cancel')}</button>
            <button className="btn-primary" onClick={handleSave}>
              <Save className="w-4 h-4" /> {t(lang, 'save')}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-600" /> 1. 기본 정보
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="한글 앱 이름">
              <input className="input" value={form.appTitleKr} onChange={(e) => set('appTitleKr', e.target.value)} />
            </Field>
            <Field label="영문 앱 이름">
              <input className="input" value={form.appTitleEn} onChange={(e) => set('appTitleEn', e.target.value)} />
            </Field>
            <Field label="한 줄 설명" full>
              <input className="input" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="상세 설명" full>
              <textarea className="input min-h-[100px]" value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-600" /> 2. 활용 정보
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="카테고리">
              <input
                list="cat-list"
                className="input"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="카테고리를 선택하거나 직접 입력"
              />
              <datalist id="cat-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="상태">
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="">선택</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="활용 대상">
              <input className="input" value={form.targetUsers} onChange={(e) => set('targetUsers', e.target.value)} placeholder="예: 초등 5~6학년 학생" />
            </Field>
            <Field label="활용 장면">
              <input className="input" value={form.useCase} onChange={(e) => set('useCase', e.target.value)} placeholder="예: 국어 수업, 교사 연수" />
            </Field>
            <Field label="주요 기능 (쉼표로 구분)" full>
              <textarea
                className="input min-h-[60px]"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="예: 음성 인식, 자동 채점, 결과 공유"
              />
            </Field>
            <Field label="배포 URL">
              <input className="input" value={form.deploymentUrl} onChange={(e) => set('deploymentUrl', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="썸네일 이미지 URL">
              <input className="input" value={form.thumbnailUrl} onChange={(e) => set('thumbnailUrl', e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="우선순위">
              <select className="input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                <option value="">선택</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="마지막 확인일">
              <input
                type="date"
                className="input"
                value={form.lastCheckedAt ? form.lastCheckedAt.slice(0, 10) : ''}
                onChange={(e) => set('lastCheckedAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
              />
            </Field>
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" /> 3. 홍보 정보
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="해시태그 (쉼표/공백 구분)" full>
              <input
                className="input"
                value={hashtagsInput}
                onChange={(e) => setHashtagsInput(e.target.value)}
                placeholder="예: 교육뮤지컬, 에듀테크, 칫허브"
              />
            </Field>
            <Field label="홍보문 톤">
              <select className="input" value={form.promotionTone} onChange={(e) => set('promotionTone', e.target.value)}>
                <option value="">선택</option>
                {TONE_OPTIONS.map((tn) => (
                  <option key={tn} value={tn}>{tn}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-brand-600" /> 4. 메모
          </h4>
          <textarea
            className="input min-h-[100px]"
            value={form.memo}
            onChange={(e) => set('memo', e.target.value)}
            placeholder="개인 메모를 적어주세요. (예: 다음 학기에 사용 예정)"
          />
        </section>
      </div>
    </Modal>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

/* ============================================================
   PromoModal
============================================================ */

function PromoModal({ repo, meta, lang, onClose, onCopy, onDownload }) {
  const promo = useMemo(() => buildPromo(repo, meta), [repo, meta]);
  const [tab, setTab] = useState('oneLiner');

  const tabs = [
    { id: 'oneLiner', label: t(lang, 'promoOneLiner'), content: promo.oneLiner, ext: 'txt', mime: 'text/plain' },
    { id: 'sns', label: t(lang, 'promoSns'), content: promo.sns, ext: 'txt', mime: 'text/plain' },
    { id: 'youtube', label: t(lang, 'promoYoutube'), content: promo.youtube, ext: 'txt', mime: 'text/plain' },
    { id: 'training', label: t(lang, 'promoTraining'), content: promo.training, ext: 'txt', mime: 'text/plain' },
    { id: 'json', label: t(lang, 'promoJson'), content: promo.portfolio, ext: 'json', mime: 'application/json' },
    { id: 'readme', label: t(lang, 'promoReadme'), content: promo.readme, ext: 'md', mime: 'text/markdown' },
  ];

  const active = tabs.find((tb) => tb.id === tab);
  const baseName = (meta.appTitleEn || repo.name || 'chithub').toLowerCase().replace(/[^a-z0-9-_]+/g, '-');

  return (
    <Modal
      title={`${t(lang, 'promoH1')} · ${repo.full_name}`}
      onClose={onClose}
      wide
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button className="btn-secondary" onClick={() => onCopy(active.content)}>
            <Copy className="w-4 h-4" /> {t(lang, 'copy')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => onDownload(`${baseName}-${active.id}.txt`, active.content, 'text/plain')}
          >
            <Download className="w-4 h-4" /> TXT
          </button>
          <button
            className="btn-secondary"
            onClick={() => onDownload(`${baseName}-${active.id}.md`, active.content, 'text/markdown')}
          >
            <Download className="w-4 h-4" /> MD
          </button>
          <button
            className="btn-primary"
            onClick={() => onDownload(`${baseName}-${active.id}.${active.ext}`, active.content, active.mime)}
          >
            <Download className="w-4 h-4" /> {active.ext.toUpperCase()}
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              tab === tb.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            aria-pressed={tab === tb.id}
          >
            {tb.label}
          </button>
        ))}
      </div>
      <textarea
        readOnly
        className="input font-mono text-xs min-h-[260px] w-full"
        value={active.content}
        aria-label={active.label}
      />
      <p className="text-xs text-slate-500 mt-2">
        편집 화면에서 더 자세한 정보를 입력할수록 홍보 자료의 품질이 좋아집니다.
      </p>
    </Modal>
  );
}

/* ============================================================
   HelpModal
============================================================ */

function HelpModal({ lang, onClose }) {
  return (
    <Modal title={t(lang, 'secretInfoTitle')} onClose={onClose}>
      <div className="prose prose-sm max-w-none">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> 토큰을 안전하게 다루는 방법
        </h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>공개 리포지토리만 조회할 경우 GitHub Username만 입력하면 됩니다.</li>
          <li>비공개 리포지토리를 불러오려면 GitHub Personal Access Token이 필요합니다.</li>
          <li>토큰은 비밀번호처럼 중요한 정보이므로 개인 기기에서만 사용하세요.</li>
          <li>이 앱은 기본적으로 토큰을 저장하지 않으며, “이 브라우저에 토큰 저장”을 체크한 경우에만 <code>localStorage</code>에 저장됩니다.</li>
          <li>저장된 토큰은 언제든지 <strong>설정 → 저장된 토큰 삭제</strong>에서 즉시 삭제할 수 있습니다.</li>
          <li>가능하면 <strong>fine-grained personal access token</strong>을 사용하고 필요한 리포지토리의 <strong>읽기 권한만</strong> 허용하세요.</li>
          <li>실제 공개 배포 서비스에서는 토큰을 프론트엔드에 직접 저장하기보다 Cloudflare Workers, Vercel Functions, Netlify Functions 등 <strong>서버 환경변수</strong>로 관리하는 방식이 더 안전합니다.</li>
        </ul>

        <h4 className="font-bold text-slate-900 mt-4 flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-brand-600" /> 사용 흐름
        </h4>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
          <li>연동하기 — Username 입력 후 “공개 리포지토리 불러오기” 또는 토큰으로 “내 리포지토리 불러오기”</li>
          <li>리포지토리 확인 — 카드 또는 표에서 한눈에 확인</li>
          <li>앱 정보 정리 — 편집 모달에서 앱 이름, 설명, 카테고리 등 입력</li>
          <li>홍보자료 생성 — 한 줄 소개, SNS, 유튜브, 연수자료, README 자동 생성</li>
          <li>백업/내보내기 — JSON 백업(토큰 제외) 및 CSV 다운로드</li>
        </ol>

        <h4 className="font-bold text-slate-900 mt-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-600" /> 데이터 저장 위치
        </h4>
        <p className="text-sm text-slate-700">
          모든 사용자 입력 데이터는 이 브라우저의 <code>localStorage</code>에 저장됩니다. 외부 서버로 전송되지 않으며, JSON 백업 파일에도 토큰은 포함되지 않습니다.
        </p>
      </div>
    </Modal>
  );
}

/* ============================================================
   SettingsModal
============================================================ */

function SettingsModal({
  lang, settings, onChangeLang, onResetUsername, onDeleteToken, onClose,
  gistSyncing, hasToken, onPushGist, onPullGist, onCopyGistId, onToggleAutoSync,
}) {
  const [localGistId, setLocalGistId] = useState(settings.gistId || '');

  useEffect(() => {
    setLocalGistId(settings.gistId || '');
  }, [settings.gistId]);

  return (
    <Modal title={t(lang, 'settings')} onClose={onClose}>
      <div className="space-y-6">
        {/* 언어 */}
        <section>
          <h4 className="font-bold text-slate-900 mb-2">언어 / Language / 言語</h4>
          <select
            className="input w-auto"
            value={settings.language}
            onChange={(e) => onChangeLang(e.target.value)}
            aria-label="Language"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </section>

        {/* 저장된 Username */}
        <section>
          <h4 className="font-bold text-slate-900 mb-2">저장된 Username</h4>
          <p className="text-sm text-slate-600 mb-2">
            현재 저장된 Username:{' '}
            {settings.savedUsername ? (
              <code className="bg-slate-100 px-1 rounded">{settings.savedUsername}</code>
            ) : (
              <span className="text-slate-400">없음</span>
            )}
          </p>
          <button className="btn-secondary" onClick={onResetUsername}>
            <Trash2 className="w-4 h-4" /> 저장된 Username 비우기
          </button>
        </section>

        {/* 토큰 관리 */}
        <section>
          <h4 className="font-bold text-slate-900 mb-2">토큰 관리</h4>
          <p className="text-sm text-slate-600 mb-2">
            현재 토큰 저장 상태:{' '}
            {settings.saveToken && settings.savedToken ? (
              <span className="text-emerald-700 font-semibold">저장됨</span>
            ) : (
              <span className="text-slate-500 font-semibold">저장되지 않음</span>
            )}
          </p>
          <button className="btn-danger" onClick={onDeleteToken}>
            <Trash2 className="w-4 h-4" /> {t(lang, 'deleteToken')}
          </button>
        </section>

        {/* Gist 동기화 */}
        <section className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 space-y-3">
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-brand-600" /> {t(lang, 'gistSyncTitle')}
            </h4>
            <p className="text-xs text-slate-600 mt-1">{t(lang, 'gistSyncDesc')}</p>
          </div>

          {!hasToken && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {t(lang, 'gistNoToken')}
            </div>
          )}

          <div>
            <label className="label text-xs" htmlFor="gist-id-input">{t(lang, 'gistIdLabel')}</label>
            <div className="flex gap-2">
              <input
                id="gist-id-input"
                className="input text-xs font-mono flex-1"
                value={localGistId}
                onChange={(e) => setLocalGistId(e.target.value)}
                placeholder={t(lang, 'gistIdPlaceholder')}
                spellCheck="false"
              />
              <button
                className="btn-secondary text-xs py-1.5 shrink-0"
                onClick={() => onCopyGistId(localGistId)}
                disabled={!localGistId}
                aria-label={t(lang, 'gistCopyId')}
              >
                <Copy className="w-3.5 h-3.5" /> {t(lang, 'gistCopyId')}
              </button>
            </div>
            {localGistId && (
              <p className="text-xs text-slate-500 mt-1">{t(lang, 'gistIdHint')}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn-primary text-sm"
              onClick={onPushGist}
              disabled={gistSyncing || !hasToken}
            >
              {gistSyncing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CloudUpload className="w-4 h-4" />}
              {t(lang, 'gistUpload')}
            </button>
            <button
              className="btn-secondary text-sm"
              onClick={() => onPullGist(localGistId)}
              disabled={gistSyncing || !localGistId}
            >
              {gistSyncing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CloudDownload className="w-4 h-4" />}
              {t(lang, 'gistDownload')}
            </button>
          </div>

          {/* Auto sync toggle */}
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-slate-300"
                checked={settings.autoSync !== false}
                onChange={(e) => onToggleAutoSync(e.target.checked)}
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-slate-800">
                  {t(lang, 'autoSyncTitle')}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {t(lang, 'autoSyncDesc')}
                </span>
                <span className={`mt-1.5 inline-flex items-center gap-1 text-xs ${
                  settings.autoSync !== false && hasToken && settings.gistId
                    ? 'text-emerald-700'
                    : 'text-slate-500'
                }`}>
                  {settings.autoSync !== false && hasToken && settings.gistId ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> {t(lang, 'autoSyncEnabled')}</>
                  ) : (
                    <><Info className="w-3.5 h-3.5" /> {t(lang, 'autoSyncDisabled')}</>
                  )}
                </span>
              </span>
            </label>
          </div>

          {settings.lastGistSyncAt && (
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t(lang, 'gistLastSync')}: {formatDateTime(settings.lastGistSyncAt)}
            </p>
          )}

          <p className="text-xs text-slate-500 flex items-start gap-1">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-600" />
            {t(lang, 'gistScopeHint')}
          </p>
        </section>

        {/* 참고 */}
        <section className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
          <strong className="text-slate-800 block mb-1">참고</strong>
          이 앱은 편집 데이터를 브라우저 localStorage에 저장합니다. Gist 동기화를 사용하면 GitHub Gist(비공개)를 통해 기기 간 공유가 가능합니다. JSON 백업 및 Gist 업로드 파일에는 토큰이 포함되지 않습니다.
        </section>
      </div>
    </Modal>
  );
}
