// @ts-check
const { expect } = require("@playwright/test");

class RegistrationPage {
  constructor(page) {
    this.page = page;
  }

  getSignUpButton() {
    return this.page.getByRole("button", { name: "Sign up" });
  }

  getRegistrationHeading() {
    return this.page.getByRole("heading", { name: "Registration" });
  }

  getRegistrationForm() {
    return this.page.getByRole("dialog").filter({ hasText: "Registration" });
  }

  getNameInput() {
    return this.getRegistrationForm().locator("#signupName");
  }

  getLastNameInput() {
    return this.getRegistrationForm().locator("#signupLastName");
  }

  getEmailInput() {
    return this.getRegistrationForm().locator("#signupEmail");
  }

  getPasswordInput() {
    return this.getRegistrationForm().locator("#signupPassword");
  }

  getRepeatPasswordInput() {
    return this.getRegistrationForm().locator("#signupRepeatPassword");
  }

  getRegisterButton() {
    return this.getRegistrationForm().getByRole("button", { name: "Register" });
  }

  getErrorMessage(errorText) {
    return this.getRegistrationForm().getByText(errorText);
  }

  getGaragePageTitle() {
    return this.page.getByRole("heading", { name: "Garage" });
  }

  getMyProfileButton() {
    return this.page.getByRole("button", { name: "My profile" });
  }

  async open() {
    await this.page.goto("/");
    await this.getSignUpButton().click();
    await expect(this.getRegistrationHeading()).toBeVisible();
  }

  async fillForm({ name, lastName, email, password, repeatPassword }) {
    await this.getNameInput().fill(name);
    await this.getLastNameInput().fill(lastName);
    await this.getEmailInput().fill(email);
    await this.getPasswordInput().fill(password);
    await this.getRepeatPasswordInput().fill(repeatPassword);
  }

  async submitForm() {
    await expect(this.getRegisterButton()).toBeEnabled();
    await this.getRegisterButton().click();
  }

  async assertFormFieldsVisible() {
    await expect(this.getNameInput()).toBeVisible();
    await expect(this.getLastNameInput()).toBeVisible();
    await expect(this.getEmailInput()).toBeVisible();
    await expect(this.getPasswordInput()).toBeVisible();
    await expect(this.getRepeatPasswordInput()).toBeVisible();
    await expect(this.getRegisterButton()).toBeVisible();
  }

  async assertInvalidField(input, errorText) {
    await expect(this.getErrorMessage(errorText)).toBeVisible();
    await expect(input).toHaveClass(/is-invalid|ng-invalid/);
  }

  async assertSuccessfulRegistration() {
    await expect(this.page).toHaveURL(/\/panel\/garage/);
    await expect(this.getGaragePageTitle()).toBeVisible();
    await expect(this.getMyProfileButton()).toBeVisible();
  }
}

module.exports = { RegistrationPage };
