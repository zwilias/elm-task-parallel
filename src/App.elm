module App exposing (main)

import Html exposing (Html, text)
import Process
import Task exposing (Task)
import Task.Parallel as Task
import Time


tasks : Task String (List ())
tasks =
    Task.parallel
        [ Process.sleep (1.5 * Time.second) |> Task.map (Debug.log "done")
        , Process.sleep (1 * Time.second) |> Task.andThen (\_ -> Task.fail "oi") |> Task.map (Debug.log "done")
        , Process.sleep (0.8 * Time.second) |> Task.map (Debug.log "done")
        , Process.sleep (1.2 * Time.second) |> Task.map (Debug.log "done")
        ]
        |> Task.map (Debug.log "all done")


type Msg
    = Ran (Result String (List ()))


type Model
    = Waiting
    | Done


init : ( Model, Cmd Msg )
init =
    ( Waiting, Task.attempt Ran tasks )


update : Msg -> Model -> ( Model, Cmd msg )
update (Ran _) _ =
    Done ! []


view : Model -> Html msg
view state =
    text <| toString state


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }
