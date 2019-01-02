// settings controller, for admin settings panel
// import SETTINGS from './Settings';

// by mvp1, just //Set dates of open and closed registration

export default class SettingsController {
  async setOpenRegDate(date: Date) {
    console.log(`Set reg open date to ${date}`);
  }
  async setCloseRegDate(date: Date) {
    console.log(`Set reg close date to ${date}`);
  }
}
