module Task.Parallel exposing (parallel)

{-| Run a bunch of tasks in parallel.

@docs parallel
-}

import Task exposing (Task)
import Native.Task.Parallel


{-| Combine a number of tasks (like `Task.sequence`) but execute them in
parallel rather than sequentially.

Just like sequence, this results in a list with the values of the successful
tasks in the same order as they were passed to `parallel`. As soon as one of
them fails, the overall task fails immedeately.

*Note*: even if the very first task fails, the rest will _still execute_,
blackholing the results into oblivion. Cancelling tasks that are already
scheduled and may or may not have finished running may be possible in some cases
but the complexity of implementation vs the relatively low reward means I did
not.
-}
parallel : List (Task e a) -> Task e (List a)
parallel =
    Native.Task.Parallel.parallel
