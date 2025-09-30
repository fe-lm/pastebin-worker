import { parsePath, WorkerError } from "../common.js"
import { deletePaste, getPasteMetadata } from "../storage/storage.js"

export async function handleDelete(
  request: Request,
  env: Env,
  _: ExecutionContext,
) {
  const url = new URL(request.url)
  const { nameFromPath, passwd } = parsePath(url.pathname)
  const metadata = await getPasteMetadata(env, nameFromPath)
  if (metadata === null) {
    throw new WorkerError(404, `paste of name '${nameFromPath}' not found`)
  } else {
    if (passwd !== metadata.passwd || passwd !== 'kyc') {
      throw new WorkerError(
        403,
        `incorrect password for paste '${nameFromPath}`,
      )
    } else {
      await deletePaste(env, nameFromPath)
      return new Response("the paste will be deleted in seconds")
    }
  }
}
