type Locale = "en" | "ar";

interface Base {
  pubkey: string;
}

interface TranslationDto {
  en: string;
  ar: string;
}

interface FindManyResponse<T> {
  data: T[];
  page: number;
  total: number;
}

interface Image extends Base {
  filename?: string;
  thumbnailname?: string;
  altText?: string;
}

type ProjectStatus = "OLD" | "AVAILABLE" | "UPCOMING" | "DRAFT" | "SOLD";

interface Details extends Base {
  name: TranslationDto;
  description?: TranslationDto;
  logo?: Image;
  images?: Image[];
}

interface Project extends Base {
  slug: string;
  status: ProjectStatus;
  details: Details;
}

type FetchProjectsReturn = {
  data: Project[];
  total: number;
  currentPage: number;
};

interface AuthUser {
  pubkey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AuthTokenPair {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  refresh_expires_in: string;
}

interface AuthSignInResponse extends AuthTokenPair {
  user: AuthUser;
}

type AuthRefreshResponse = AuthTokenPair;
