export const onRequest: PagesFunction = async (context) => {
  // Handle SSR requests
  return await handleSSR(context)
}
