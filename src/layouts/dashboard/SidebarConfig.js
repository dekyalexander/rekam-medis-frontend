// routes
import { PATH_DASHBOARD, PATH_PAGE, PATH_AUTH } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: 22, height: 22 }}
  />
);

const ICONS = {
  map: getIcon('ic_map'),
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  page: getIcon('ic_page'),
  user: getIcon('ic_user'),
  copy: getIcon('ic_copy'),
  error: getIcon('ic_error'),
  charts: getIcon('ic_charts'),
  editor: getIcon('ic_editor'),
  upload: getIcon('ic_upload'),
  animate: getIcon('ic_animate'),
  calendar: getIcon('ic_calendar'),
  elements: getIcon('ic_elements'),
  carousel: getIcon('ic_carousel'),
  language: getIcon('ic_language'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  components: getIcon('ic_components'),
  authenticator: getIcon('ic_authenticator')
};

const MenuLinks = [
  {
    items: [
      {
        title: 'Dashboard',
        href: PATH_DASHBOARD.general.app,
        icon: getIcon('ic_analytics')
      },
      {
        title: 'Application',
        href: PATH_DASHBOARD.application,
        icon: getIcon('ic_analytics')
      },
      {
        title: 'Menu',
        href: PATH_DASHBOARD.menu,
        icon: getIcon('ic_analytics')
      },
      {
        title: 'Action',
        href: PATH_DASHBOARD.action,
        icon: getIcon('ic_analytics')
      },
      {
        title: 'Role',
        href: PATH_DASHBOARD.role,
        icon: getIcon('ic_analytics')
      },
      {
        title: 'User',
        href: PATH_DASHBOARD.user.root,
        icon: getIcon('ic_analytics')
      },
      {
        title: 'Parameter',
        href: PATH_DASHBOARD.parameter,
        icon: getIcon('ic_analytics')
      }
    ]
  }
];

export default MenuLinks;
