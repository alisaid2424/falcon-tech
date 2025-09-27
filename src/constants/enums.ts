export enum Routes {
  ROOT = "/",
  CATEGORIE = "/category",
  CATEGORIES = "/admin/categories",
  ABOUT = "/about",
  CONTACT = "/contact",
  AUTH = "/auth",
  CART = "/cart",
  PROFILE = "/profile",
  ADMIN = "/admin",
}

export enum Pages {
  LOGIN = "/signin",
  Register = "/signup",
  CATEGORIES = "/categories",
  PRODUCTS = "/admin/products",
  USERS = "/admin/users",
  ORDERS = "/admin/orders",
  NEW = "/new",
  EDIT = "/edit",
}

export const CATEGORIES_PER_PAGE = 3;
export const USERS_PER_PAGE = 3;
export const PRODUCTS_PER_PAGE = 3;
export const ORDERS_PER_PAGE = 3;

const PRODUCTION_DOMAIN = "https://falcon-tech-mu.vercel.app";

const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;
