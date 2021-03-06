import vaadinAccordionPanel from "./elements/vaadin-accordion-panel.json";
import vaadinAccordion from "./elements/vaadin-accordion.json";
import vaadinAppLayout from "./elements/vaadin-app-layout.json";
import vaadinAvatarGroupListBox from "./elements/vaadin-avatar-group-list-box.json";
import vaadinAvatarGroupOverlay from "./elements/vaadin-avatar-group-overlay.json";
import vaadinAvatarGroup from "./elements/vaadin-avatar-group.json";
import vaadinAvatar from "./elements/vaadin-avatar.json";
import vaadinBoardRow from "./elements/vaadin-board-row.json";
import vaadinBoard from "./elements/vaadin-board.json";
import vaadinButton from "./elements/vaadin-button.json";
import vaadinChart from "./elements/vaadin-chart.json";
import vaadinCheckboxGroup from "./elements/vaadin-checkbox-group.json";
import vaadinCheckbox from "./elements/vaadin-checkbox.json";
import vaadinComboBoxItem from "./elements/vaadin-combo-box-item.json";
import vaadinComboBoxLight from "./elements/vaadin-combo-box-light.json";
import vaadinComboBoxOverlay from "./elements/vaadin-combo-box-overlay.json";
import vaadinComboBox from "./elements/vaadin-combo-box.json";
import vaadinConfirmDialog from "./elements/vaadin-confirm-dialog.json";
import vaadinContextMenu from "./elements/vaadin-context-menu.json";
import vaadinContextMenuItem from "./elements/vaadin-context-menu-item.json";
import vaadinContextMenuListBox from "./elements/vaadin-context-menu-list-box.json";
import vaadinContextMenuOverlay from "./elements/vaadin-context-menu-overlay.json";
import vaadinCookieConsent from "./elements/vaadin-cookie-consent.json";
import vaadinCrudEdit from "./elements/vaadin-crud-edit.json";
import vaadinCrudForm from "./elements/vaadin-crud-form.json";
import vaadinCrudGrid from "./elements/vaadin-crud-grid.json";
import vaadinCrud from "./elements/vaadin-crud.json";
import vaadinCustomField from "./elements/vaadin-custom-field.json";
import vaadinDatePickerLight from "./elements/vaadin-date-picker-light.json";
import vaadinDatePickerOverlayContent from "./elements/vaadin-date-picker-overlay-content.json";
import vaadinDatePickerOverlay from "./elements/vaadin-date-picker-overlay.json";
import vaadinDatePicker from "./elements/vaadin-date-picker.json";
import vaadinDateTimePickerDatePicker from "./elements/vaadin-date-time-picker-date-picker.json";
import vaadinDateTimePickerTimePicker from "./elements/vaadin-date-time-picker-time-picker.json";
import vaadinDateTimePicker from "./elements/vaadin-date-time-picker.json";
import vaadinDetails from "./elements/vaadin-details.json";
import vaadinDialogOverlay from "./elements/vaadin-dialog-overlay.json";
import vaadinDialog from "./elements/vaadin-dialog.json";
import vaadinDrawerToggle from "./elements/vaadin-drawer-toggle.json";
import vaadinEmailField from "./elements/vaadin-email-field.json";
import vaadinFormItem from "./elements/vaadin-form-item.json";
import vaadinFormLayout from "./elements/vaadin-form-layout.json";
import vaadinGridProEditCheckbox from "./elements/vaadin-grid-pro-edit-checkbox.json";
import vaadinGridProEditSelect from "./elements/vaadin-grid-pro-edit-select.json";
import vaadinGridProEditTextField from "./elements/vaadin-grid-pro-edit-text-field.json";
import vaadinGridPro from "./elements/vaadin-grid-pro.json";
import vaadinGridSorter from "./elements/vaadin-grid-sorter.json";
import vaadinGridTreeToggle from "./elements/vaadin-grid-tree-toggle.json";
import vaadinGrid from "./elements/vaadin-grid.json";
import vaadinHorizontalLayout from "./elements/vaadin-horizontal-layout.json";
import vaadinIcon from "./elements/vaadin-icon.json";
import vaadinIntegerField from "./elements/vaadin-integer-field.json";
import vaadinItem from "./elements/vaadin-item.json";
import vaadinListBox from "./elements/vaadin-list-box.json";
import vaadinLoginFormWrapper from "./elements/vaadin-login-form-wrapper.json";
import vaadinLoginForm from "./elements/vaadin-login-form.json";
import vaadinLoginOverlay from "./elements/vaadin-login-overlay.json";
import vaadinLoginOverlayWrapper from "./elements/vaadin-login-overlay-wrapper.json";
import vaadinMenuBarButton from "./elements/vaadin-menu-bar-button.json";
import vaadinMenuBar from "./elements/vaadin-menu-bar.json";
import vaadinMessageAvatar from "./elements/vaadin-message-avatar.json";
import vaadinMessageInputButton from "./elements/vaadin-message-input-button.json";
import vaadinMessageInputTextArea from "./elements/vaadin-message-input-text-area.json";
import vaadinMessageInput from "./elements/vaadin-message-input.json";
import vaadinMessageList from "./elements/vaadin-message-list.json";
import vaadinMessage from "./elements/vaadin-message.json";
import vaadinMonthCalendar from "./elements/vaadin-month-calendar.json";
import vaadinNotification from "./elements/vaadin-notification.json";
import vaadinNotificationCard from "./elements/vaadin-notification-card.json";
import vaadinNumberField from "./elements/vaadin-number-field.json";
import vaadinOverlay from "./elements/vaadin-overlay.json";
import vaadinPasswordField from "./elements/vaadin-password-field.json";
import vaadinProgressBar from "./elements/vaadin-progress-bar.json";
import vaadinRadioButton from "./elements/vaadin-radio-button.json";
import vaadinRadioGroup from "./elements/vaadin-radio-group.json";
import vaadinRichTextEditor from "./elements/vaadin-rich-text-editor.json";
import vaadinScroller from "./elements/vaadin-scroller.json";
import vaadinSelectOverlay from "./elements/vaadin-select-overlay.json";
import vaadinSelectValueButton from "./elements/vaadin-select-value-button.json";
import vaadinSelect from "./elements/vaadin-select.json";
import vaadinSplitLayout from "./elements/vaadin-split-layout.json";
import vaadinTab from "./elements/vaadin-tab.json";
import vaadinTabs from "./elements/vaadin-tabs.json";
import vaadinTextArea from "./elements/vaadin-text-area.json";
import vaadinTextField from "./elements/vaadin-text-field.json";
import vaadinTimePickerItem from "./elements/vaadin-time-picker-item.json";
import vaadinTimePickerOverlay from "./elements/vaadin-time-picker-overlay.json";
import vaadinTimePicker from "./elements/vaadin-time-picker.json";
import vaadinUploadFile from "./elements/vaadin-upload-file.json";
import vaadinUpload from "./elements/vaadin-upload.json";
import vaadinVerticalLayout from "./elements/vaadin-vertical-layout.json";
import vaadinVirtualList from "./elements/vaadin-virtual-list.json";

export interface VaadinElementPart {
  name: string;
  description: string;
}

export interface VaadinElementState {
  attribute: string;
  description: string;
  partName: string;
}

export interface VaadinElementThemeSettings {
  /**
   * Specifies how individual instances of a component can be themed.
   * Currently we support:
   * - Host: The element is accessible from code, and the developer can set a custom theme variant on it
   * - Theme propagation: The element is a sub-component, and not accessible from code, or within a shadow DOM. However its host element propagates its theme attribute to it.
   * - None: The element is a sub-component, and not accessible from code, or within a shadow DOM. It it not possible to theme specific instances of this component.
   *
   * This setting affects the instructions for how to apply a theme to a specific element instance.
   */
  individualThemeMechanism: "host" | "themePropagation" | "none",
  /**
   * Specifies from which host component the theme attribute is propagated.
   *
   * This setting affects the instructions for how to apply a theme to a specific element instance.
   *
   * This setting is only relevant when the `themePropagation` mechanism is used.
   */
  themePropagatedFrom?: string
}

export interface VaadinElementMetaData {
  elementName: string;
  displayName: string;
  themeSettings: VaadinElementThemeSettings;
  parts: VaadinElementPart[];
  states: VaadinElementState[];
}

interface MetaDataRegistry {
  [elementName: string]: VaadinElementMetaData;
}

const registry: MetaDataRegistry = {};

function registerMetaData(metaData: VaadinElementMetaData) {
  registry[metaData.elementName] = metaData;
}

export function getMetaData(elementName: string): VaadinElementMetaData | null {
  return registry[elementName] || null;
}

registerMetaData(vaadinAccordionPanel as VaadinElementMetaData);
registerMetaData(vaadinAccordion as VaadinElementMetaData);
registerMetaData(vaadinAppLayout as VaadinElementMetaData);
registerMetaData(vaadinAvatarGroupListBox as VaadinElementMetaData);
registerMetaData(vaadinAvatarGroupOverlay as VaadinElementMetaData);
registerMetaData(vaadinAvatarGroup as VaadinElementMetaData);
registerMetaData(vaadinAvatar as VaadinElementMetaData);
registerMetaData(vaadinBoardRow as VaadinElementMetaData);
registerMetaData(vaadinBoard as VaadinElementMetaData);
registerMetaData(vaadinButton as VaadinElementMetaData);
registerMetaData(vaadinChart as VaadinElementMetaData);
registerMetaData(vaadinCheckboxGroup as VaadinElementMetaData);
registerMetaData(vaadinCheckbox as VaadinElementMetaData);
registerMetaData(vaadinComboBoxItem as VaadinElementMetaData);
registerMetaData(vaadinComboBoxLight as VaadinElementMetaData);
registerMetaData(vaadinComboBoxOverlay as VaadinElementMetaData);
registerMetaData(vaadinComboBox as VaadinElementMetaData);
registerMetaData(vaadinConfirmDialog as VaadinElementMetaData);
registerMetaData(vaadinContextMenu as VaadinElementMetaData);
registerMetaData(vaadinContextMenuItem as VaadinElementMetaData);
registerMetaData(vaadinContextMenuListBox as VaadinElementMetaData);
registerMetaData(vaadinContextMenuOverlay as VaadinElementMetaData);
registerMetaData(vaadinCookieConsent as VaadinElementMetaData);
registerMetaData(vaadinCrudEdit as VaadinElementMetaData);
registerMetaData(vaadinCrudForm as VaadinElementMetaData);
registerMetaData(vaadinCrudGrid as VaadinElementMetaData);
registerMetaData(vaadinCrud as VaadinElementMetaData);
registerMetaData(vaadinCustomField as VaadinElementMetaData);
registerMetaData(vaadinDatePickerLight as VaadinElementMetaData);
registerMetaData(vaadinDatePickerOverlayContent as VaadinElementMetaData);
registerMetaData(vaadinDatePickerOverlay as VaadinElementMetaData);
registerMetaData(vaadinDatePicker as VaadinElementMetaData);
registerMetaData(vaadinDateTimePickerDatePicker as VaadinElementMetaData);
registerMetaData(vaadinDateTimePickerTimePicker as VaadinElementMetaData);
registerMetaData(vaadinDateTimePicker as VaadinElementMetaData);
registerMetaData(vaadinDetails as VaadinElementMetaData);
registerMetaData(vaadinDialogOverlay as VaadinElementMetaData);
registerMetaData(vaadinDialog as VaadinElementMetaData);
registerMetaData(vaadinDrawerToggle as VaadinElementMetaData);
registerMetaData(vaadinEmailField as VaadinElementMetaData);
registerMetaData(vaadinFormItem as VaadinElementMetaData);
registerMetaData(vaadinFormLayout as VaadinElementMetaData);
registerMetaData(vaadinGridProEditCheckbox as VaadinElementMetaData);
registerMetaData(vaadinGridProEditSelect as VaadinElementMetaData);
registerMetaData(vaadinGridProEditTextField as VaadinElementMetaData);
registerMetaData(vaadinGridPro as VaadinElementMetaData);
registerMetaData(vaadinGridSorter as VaadinElementMetaData);
registerMetaData(vaadinGridTreeToggle as VaadinElementMetaData);
registerMetaData(vaadinGrid as VaadinElementMetaData);
registerMetaData(vaadinHorizontalLayout as VaadinElementMetaData);
registerMetaData(vaadinIcon as VaadinElementMetaData);
registerMetaData(vaadinIntegerField as VaadinElementMetaData);
registerMetaData(vaadinItem as VaadinElementMetaData);
registerMetaData(vaadinListBox as VaadinElementMetaData);
registerMetaData(vaadinLoginFormWrapper as VaadinElementMetaData);
registerMetaData(vaadinLoginForm as VaadinElementMetaData);
registerMetaData(vaadinLoginOverlay as VaadinElementMetaData);
registerMetaData(vaadinLoginOverlayWrapper as VaadinElementMetaData);
registerMetaData(vaadinMenuBarButton as VaadinElementMetaData);
registerMetaData(vaadinMenuBar as VaadinElementMetaData);
registerMetaData(vaadinMessageAvatar as VaadinElementMetaData);
registerMetaData(vaadinMessageInputButton as VaadinElementMetaData);
registerMetaData(vaadinMessageInputTextArea as VaadinElementMetaData);
registerMetaData(vaadinMessageInput as VaadinElementMetaData);
registerMetaData(vaadinMessageList as VaadinElementMetaData);
registerMetaData(vaadinMessage as VaadinElementMetaData);
registerMetaData(vaadinMonthCalendar as VaadinElementMetaData);
registerMetaData(vaadinNotification as VaadinElementMetaData);
registerMetaData(vaadinNotificationCard as VaadinElementMetaData);
registerMetaData(vaadinNumberField as VaadinElementMetaData);
registerMetaData(vaadinOverlay as VaadinElementMetaData);
registerMetaData(vaadinPasswordField as VaadinElementMetaData);
registerMetaData(vaadinProgressBar as VaadinElementMetaData);
registerMetaData(vaadinRadioButton as VaadinElementMetaData);
registerMetaData(vaadinRadioGroup as VaadinElementMetaData);
registerMetaData(vaadinRichTextEditor as VaadinElementMetaData);
registerMetaData(vaadinScroller as VaadinElementMetaData);
registerMetaData(vaadinSelectOverlay as VaadinElementMetaData);
registerMetaData(vaadinSelectValueButton as VaadinElementMetaData);
registerMetaData(vaadinSelect as VaadinElementMetaData);
registerMetaData(vaadinSplitLayout as VaadinElementMetaData);
registerMetaData(vaadinTab as VaadinElementMetaData);
registerMetaData(vaadinTabs as VaadinElementMetaData);
registerMetaData(vaadinTextArea as VaadinElementMetaData);
registerMetaData(vaadinTextField as VaadinElementMetaData);
registerMetaData(vaadinTimePickerItem as VaadinElementMetaData);
registerMetaData(vaadinTimePickerOverlay as VaadinElementMetaData);
registerMetaData(vaadinTimePicker as VaadinElementMetaData);
registerMetaData(vaadinUploadFile as VaadinElementMetaData);
registerMetaData(vaadinUpload as VaadinElementMetaData);
registerMetaData(vaadinVerticalLayout as VaadinElementMetaData);
registerMetaData(vaadinVirtualList as VaadinElementMetaData);
