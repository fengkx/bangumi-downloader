export type FileList = {
  kind: "drive#fileList";
  next_page_token: string;
  files: Array<File | Folder>;
  version: string;
  version_outdated: boolean;
  sync_time: string;
};

export type Folder = {
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

export type File = {
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
export type RequestListFiles = Partial<{
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
