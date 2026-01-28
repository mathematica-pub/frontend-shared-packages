export interface GenericScale<Domain, Range> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any): Range;
  domain?(): [Domain, Domain];
  range?(): [Range, Range];
}
