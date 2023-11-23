import { always, andThen, anyPass, ifElse, isEmpty, isNil, tap } from "ramda";

/** Check if a value is nil or empty. */
export const isNilOrEmpty: (value: any) => boolean = anyPass([isNil, isEmpty]);

/** Execute an action on a value if it is defined. Return undefined otherwise. */
export const ifDefined: <V, R>(
  action: (value: V) => R,
) => (value: V | undefined) => R | undefined = (action) =>
  ifElse(isNilOrEmpty, always(undefined), (value) => action(value));

/** Execute an action on the resolved value of a promise if the value is defined. */
export const andThenIfDefined: <V, R>(
  action: (value: V) => R,
) => (promise: Promise<V | undefined>) => Promise<R | undefined> = (action) =>
  andThen(ifDefined(action));

/** Peek at a value by logging it to the console and returning it. */
export const peek: <V>(message: string) => (value: V) => V = (message) =>
  tap(console.log.bind(console, message));
