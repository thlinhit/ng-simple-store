import * as faker from 'faker';

export class EventHistory {
  constructor(
    public eventId: string,
    public type: string,
    public createdAt: string,
    public title: string,
    public partnerIds: string[],
    public contractIds: string[],
    public caseNumbers: string[]
  ) {}
}

export class EventHistoryBuilder {
  static build(): EventHistory {
    return new EventHistory(
      faker.finance.account(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      [faker.lorem.sentence()],
      [faker.lorem.sentence()],
      [faker.lorem.sentence()]
    );
  }
}
