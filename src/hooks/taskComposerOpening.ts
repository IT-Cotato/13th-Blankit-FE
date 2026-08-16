interface OpenTaskComposerWithOptionsArgs<T> {
  openComposer: () => void;
  loadOptions: () => Promise<T>;
  applyOptions: (options: T) => void;
}

export async function openTaskComposerWithOptions<T>({
  openComposer,
  loadOptions,
  applyOptions,
}: OpenTaskComposerWithOptionsArgs<T>): Promise<void> {
  openComposer();
  const options = await loadOptions();
  applyOptions(options);
}
