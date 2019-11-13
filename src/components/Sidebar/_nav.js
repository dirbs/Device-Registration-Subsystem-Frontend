import i18n from './../../i18n'
export default {
  items: [
    {
      title: true,
      name: i18n.t('mainNavigation'),
      wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
        id: 2,
        name: 'dashboardLink',
        url: '/dashboard',
        icon: 'fa fa-tachometer',
    },
    {
        id: 3,
        name: 'newRequestLink',
        url: '/new-request/id',
        icon: 'fa fa-barcode',
    },
    {
        id: 5,
        name: 'deRegistrationLink',
        url: '/de-registration/id',
        icon: 'fa fa-ban',
    },
    {
        id: 4,
        name: 'searchRequestLink',
        url: '/search-requests',
        icon: 'fa fa-search',
    }
  ]
};
