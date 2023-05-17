## openKV

Deno.KV for the rest of us.

## Background:

Both [Deno](https://deno.com/kv) and Vercel have release their in-built key-value storage for the runtimes for developers.


### spec :
Operations that are supported :

  - GET  : get the current value of the specific key.
  - SET  : set the given key to the particular value .
  - DELETE : delete the given key, if not given then raise Error.
  - COUNT : count the number of keys that have been set to the sepcific value.
  - BEGIN
  - END 
  - ROLLBACK
  - COMMIT 
