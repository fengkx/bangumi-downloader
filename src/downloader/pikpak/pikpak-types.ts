export type PikpakFileList = {
  kind: "drive#fileList";
  next_page_token: string;
  files: Array<PikpakFile | PikpakFolder>;
  version: string;
  version_outdated: boolean;
  sync_time: string;
};

export type PikpakFolder = {
  kind: "drive#folder";
  id: string;
  parent_id: string;
  name: string;
  user_id: string;
  size: string;
  revision: string;
  file_extension: string;
  mime_type: string;
  starred: boolean;
  web_content_link: string;
  created_time: string;
  modified_time: string;
  icon_link: string;
  thumbnail_link: string;
  md5_checksum: string;
  hash: string;
  links: Record<string, unknown>;
  phase: string;
  audit: null;
  medias: unknown[];
  trashed: boolean;
  delete_time: string;
  original_url: string;
  params: {
    platform_icon: string;
  };
  original_file_index: number;
  space: string;
  apps: unknown[];
  writable: boolean;
  folder_type: string;
  collection: null;
  sort_name: string;
  user_modified_time: string;
  spell_name: unknown[];
  file_category: string;
  tags: unknown[];
  reference_events: unknown[];
  reference_resource: null;
};

export type PikpakFile = {
  kind: "drive#file";
  id: string;
  parent_id: string;
  name: string;
  user_id: string;
  size: string;
  revision: string;
  file_extension: string;
  mime_type: string;
  starred: boolean;
  web_content_link: string;
  created_time: string;
  modified_time: string;
  icon_link: string;
  thumbnail_link: string;
  md5_checksum: string;
  hash: string;
  links: Record<string, unknown>;
  phase: string;
  audit: null;
  medias: unknown[];
  trashed: boolean;
  delete_time: string;
  original_url: string;
  params: {
    duration: string;
    height: string;
    width: string;
    platform_icon: string;
  };
  original_file_index: number;
  space: string;
  apps: unknown[];
  writable: boolean;
  folder_type: string;
  collection: null;
  sort_name: string;
  user_modified_time: string;
  spell_name: unknown[];
  file_category: string;
  tags: unknown[];
  reference_events: unknown[];
  reference_resource: null;
};

type FiltersObj = Record<string, unknown>;
type ThumbnailSizeEnum = "SIZE_MEDIUM";
export type PikpakRequestListFiles = Partial<{
  parent_id: string; // 父文件夹id, 默认列出根目录
  limit: number; // 数量
  page_token: string; // 页面id
  filters: FiltersObj;
  with_audit: boolean;
  thumbnail_size: ThumbnailSizeEnum;
}>;

export type RequestCreateFolder = {
  kind: "drive#folder";
  name: string;
  parent_id?: string;
};


type PikpakQuota = {
  kind: string;
  limit: string;
  usage: string;
  usage_in_trash: string;
  play_times_limit: string;
  play_times_usage: string;
  is_unlimited: boolean;
};

export type PikPakAbout = {
  kind: string;
  quota: PikpakQuota;
  expires_at: string;
  quotas: Record<string, unknown>;
};

export type RequestOfflineDownload = {
  kind: "drive#file";
  upload_type: 'UPLOAD_TYPE_URL';
  url: {url: string};
  name?: string;
  folder_type?: string;
  parent_id?: string;
}


type UploadType = "UPLOAD_TYPE_URL";

export type PikpakDownloadTask = {
  upload_type: UploadType;
  url: {
    kind: "upload#url";
  };
  file: null;
  task: {
    kind: "drive#task";
    id: string;
    name: string;
    type: string;
    user_id: string;
    statuses: unknown[];
    status_size: number;
    params: {
      predict_speed: string;
      predict_type: string;
    };
    file_id: string;
    file_name: string;
    file_size: string;
    message: string;
    created_time: string;
    updated_time: string;
    third_task_id: string;
    // phase: "PHASE_TYPE_RUNNING";
    progress: number;
    icon_link: string;
    callback: string;
    reference_resource: null;
    space: string;
  };
};