class BaseComponent {

  constructor({
    target,
    scope = window.$document
  }) {
    const self = this;

    this.$scope = scope;
    this.$target = this.$scope.find(target);
    this.$el;

    if (this.$target && this.$target.length) {
      this.$target.each(function () {
        self.$el = $(this);
        self.set(self.$el);
        self.run(self.$el);
      });
    }
  }

  set($el) {

  }

  run($el) {

  }

}
