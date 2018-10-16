Shortly.Router = Backbone.Router.extend({
  initialize: (options) => {
    this.$el = options.el;
  },

  routes: {
    '': 'index',
    'create': 'create',
    'login': 'login',
    'signup': 'signup'
  },

  swapView: (view) => {
    this.$el.html(view.render().el);
  },

  index: () => {
    let links = new Shortly.Links();
    let linksView = new Shortly.LinksView({ collection: links });
    this.swapView(linksView);
  },

  create: () => {
    this.swapView(new Shortly.createLinkView());
  }
});
