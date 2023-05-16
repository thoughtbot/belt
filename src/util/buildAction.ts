type AsyncModule = Promise<{
  default: (...args: unknown[]) => void;
}>;

/**
 * builds the action function that is passed to Commander's
 * program.action.
 * Eg: program.action(
 *   buildAction(import('./commands/prettier))
 * )
 */
export default function buildAction(asyncModule: AsyncModule) {
  return async (...args: unknown[]) => {
    const module = await asyncModule;
    module.default(args);
  };
}
