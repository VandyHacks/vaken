import { UserType } from '../../src/client/generated/graphql';

export class NFCPlugin {
  get routeInfo() {
    return {
      displayText: "Test Module",
      path: "/test_module",
      authLevel: [UserType.Organizer]
    }
  }

  async component() {
    return await import('./components/Nfc')
  }
}

export default {
  NFCPlugin
}