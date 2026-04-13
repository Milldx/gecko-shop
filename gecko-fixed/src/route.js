import { createWebHashHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import CartView from './views/CartView.vue'
import WishlistView from './views/WishlistView.vue'
import OrdersView from './views/OrdersView.vue'
import ProductView from './views/ProductView.vue'
import ProductDescription from './views/product/ProductDescription.vue'
import ProductSpecs from './views/product/ProductSpecs.vue'
import ProductReviews from './views/product/ProductReviews.vue'
import AdminView from './views/AdminView.vue'
import AdminProducts from './views/admin/AdminProducts.vue'
import AdminAddProduct from './views/admin/AdminAddProduct.vue'
import AdminReviews from './views/admin/AdminReviews.vue'
import AdminUsers from './views/admin/AdminUsers.vue'
import EditProduct from './views/EditProduct.vue'
import NotFound from './views/NotFound.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import ProfileView from './views/ProfileView.vue'
import SizeGuideView from './views/SizeGuideView.vue'
import LoyaltyView from './views/LoyaltyView.vue'
import DeliveryView from './views/DeliveryView.vue'
import ReturnView from './views/ReturnView.vue'
import AboutView from './views/AboutView.vue'
import ContactsView from './views/ContactsView.vue'
import PressView from './views/PressView.vue'
import WomenView from './views/WomenView.vue'
import MenView from './views/MenView.vue'
import NewArrivalsView from './views/NewArrivalsView.vue'
import SaleView from './views/SaleView.vue'

const routes = [
  { path: '/login', component: LoginView, name: 'login' },
  { path: '/register', component: RegisterView, name: 'register' },
  { path: '/profile', component: ProfileView, name: 'profile', meta: { requiresAuth: true } },
  { path: '/', component: HomeView, name: 'home' },
  { path: '/women', component: WomenView, name: 'women' },
  { path: '/men', component: MenView, name: 'men' },
  { path: '/new-arrivals', component: NewArrivalsView, name: 'new-arrivals' },
  { path: '/sale', component: SaleView, name: 'sale' },
  { path: '/cart', component: CartView, name: 'cart' },
  { path: '/wishlist', component: WishlistView, name: 'wishlist' },
  { path: '/orders', component: OrdersView, name: 'orders' },
  { path: '/size-guide', component: SizeGuideView, name: 'size-guide' },
  { path: '/loyalty', component: LoyaltyView, name: 'loyalty' },
  { path: '/delivery', component: DeliveryView, name: 'delivery' },
  { path: '/return', component: ReturnView, name: 'return' },
  { path: '/about', component: AboutView, name: 'about' },
  { path: '/contacts', component: ContactsView, name: 'contacts' },
  { path: '/press', component: PressView, name: 'press' },
  {
    path: '/product/:id',
    component: ProductView,
    name: 'product',
    children: [
      { path: '', component: ProductDescription, name: 'product-description' },
      { path: 'specs', component: ProductSpecs, name: 'product-specs' },
      { path: 'reviews', component: ProductReviews, name: 'product-reviews' },
    ],
  },
  {
    path: '/admin',
    component: AdminView,
    name: 'admin',
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/products' },
      { path: 'products', component: AdminProducts, name: 'admin-products' },
      { path: 'add', component: AdminAddProduct, name: 'admin-add' },
      { path: 'reviews', component: AdminReviews, name: 'admin-reviews' },
      { path: 'users', component: AdminUsers, name: 'admin-users' },
    ],
  },
  {
    path: '/edit/:id',
    component: EditProduct,
    name: 'edit',
    meta: { requiresAdmin: true },
  },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'not-found' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(function(to, from, next) {
  const isAdmin = localStorage.getItem('isAdmin')
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export { router }
