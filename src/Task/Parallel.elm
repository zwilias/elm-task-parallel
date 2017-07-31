module Task.Parallel exposing (parallel)

import Task exposing (Task)
import Native.Task.Parallel


parallel : List (Task e a) -> Task e (List a)
parallel =
    Native.Task.Parallel.parallel
