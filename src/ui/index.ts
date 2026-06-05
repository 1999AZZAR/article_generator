// Public re-exports for the Quill UI module. The handler imports from here
// so that file internals can be split without breaking the public contract.

export { generateMainPageHTML } from './main';
export { generateSettingsPageHTML } from './settings';
export { generateAuthPageHTML } from './auth';
export {
  MAIN_STRINGS,
  SETTINGS_STRINGS,
  AUTH_STRINGS,
  getLocale,
  type Locale,
  type MainPageStrings,
  type SettingsPageStrings,
  type AuthPageStrings,
} from './i18n';
export {
  renderHead,
  renderStyle,
  renderFooter,
  SWISS_BASE_CSS,
  FOOTER_STRINGS,
} from './styles';
