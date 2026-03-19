import _extends from "@babel/runtime/helpers/esm/extends";
import { createNamespace } from '../../utils';

var _createNamespace = createNamespace('sku-row-prop-item'),
    createComponent = _createNamespace[0];

export default createComponent({
  props: {
    skuValue: Object,
    skuKeyStr: String,
    skuEventBus: Object,
    selectedProp: Object,
    multiple: Boolean,
    disabled: Boolean
  },
  computed: {
    choosed: function choosed() {
      var selectedProp = this.selectedProp,
          skuKeyStr = this.skuKeyStr,
          skuValue = this.skuValue;

      if (selectedProp && selectedProp[skuKeyStr]) {
        return selectedProp[skuKeyStr].indexOf(skuValue.id) > -1;
      }

      return false;
    }
  },
  methods: {
    onSelect: function onSelect() {
      if (this.disabled) return;
      this.skuEventBus.$emit('sku:propSelect', _extends({}, this.skuValue, {
        skuKeyStr: this.skuKeyStr,
        multiple: this.multiple
      }));
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("span", {
      "class": ['van-sku-row__item', {
        'van-sku-row__item--active': this.choosed
      }, {
        'van-sku-row__item--disabled': this.disabled
      }],
      "on": {
        "click": this.onSelect
      }
    }, [h("span", {
      "class": "van-sku-row__item-name"
    }, [this.skuValue.name])]);
  }
});