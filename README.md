## openKV

a open source KV written in Deno.

## Background:

Both [Deno](https://deno.com/kv) and [Vercel](https://vercel.com/docs/storage/vercel-kv) have release their in-built key-value storage for the runtimes for developers. But the cost is huge.

Instead use this with free stuff at runtime (compiled by Deno) on Cloudflare Workers. 

This is just for learning about key-value stores. For a more serious project check out : [r2d2](https://github.com/iuioiua/r2d2)

### spec :
Operations that are supported :

  - GET  : get the current value of the specific key.
  - SET  : set the given key to the particular value .
  - DELETE : delete the given key, if not given then raise Error.
  - COUNT : count the number of keys that have been set to the sepcific value.
  - BEGIN : starts a transaction 
  - END  : ends a transaction
  - ROLLBACK :throw back any change.
  - COMMIT : commit the change
