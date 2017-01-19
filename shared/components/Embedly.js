Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Embedly = function (_React$Component) {
  _inherits(Embedly, _React$Component);

  function Embedly(props) {
    _classCallCheck(this, Embedly);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Embedly).call(this, props));

    _this.state = {
      provider_url: '',
      description: '',
      title: '',
      thumbnail_width: 1,
      url: '',
      thumbnailUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=',
      version: '',
      provider_name: '',
      type: '',
      thumbnail_height: 1
    };
    _this.apiUrl = 'https://api.embedly.com/1/oembed';
    return _this;
  }

  _createClass(Embedly, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var params = {
        url: this.props.url,
        key: this.props.apiKey
      };

      _superagent2.default.get(this.apiUrl).query(params).end(function (err, res) {
        _this2.setState(Object.assign({}, params, res.body));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var aStyle = {
        color: "#222",
        textDecoration: "none",
        position: "relative",
        border: "solid 1px #E1E8ED",
        display: "block",
        borderRadius: "5px",
        overflow: "hidden"
      };
      var imageStyle = {
        width: "80px",
        height: "80px",
        overflow: "hidden",
        position: "absolute",
        left: 0,
        top: 0
      };
      var imgStyle = {
        height: "100%",
        width: "auto",
        transform: "translateX(-50%)",
        position: "relative",
        left: "50%"
      };
      var textStyle = {
        marginLeft: "85px",
        minHeight: "80px",
        padding: "5px",
        boxSizing: "border-box"
      };
      var titleStyle = {
        margin: 0,
        fontSize: "15px",
        fontWeight: "bold"
      };
      var descStyle = {
        margin: "5px 0 0",
        fontSize: "11px"
      };
      var providerStyle = {
        margin: "5px 0 0",
        fontSize: "11px"
      };

      return _react2.default.createElement(
        'a',
        { className: 'embedly', href: this.state.url, style: aStyle, target: '_blank' },
        _react2.default.createElement(
          'div',
          { className: 'embedly__image', style: imageStyle },
          _react2.default.createElement('img', { src: this.state.thumbnail_url, alt: this.state.title, style: imgStyle })
        ),
        _react2.default.createElement(
          'div',
          { className: 'embedly__text', style: textStyle },
          _react2.default.createElement(
            'p',
            { className: 'embedly__title', style: titleStyle },
            this.state.title
          ),
          _react2.default.createElement(
            'p',
            { className: 'embedly__desc', style: descStyle },
            this.state.description
          ),
          _react2.default.createElement(
            'p',
            { className: 'embedly__provider', style: providerStyle },
            this.state.provider_url
          )
        )
      );
    }
  }]);

  return Embedly;
}(_react2.default.Component);

exports.default = Embedly;
