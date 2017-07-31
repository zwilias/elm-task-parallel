module App exposing (main)

import Html exposing (Html, text)
import Process
import Task exposing (Task)
import Task.Parallel as Task
import Time


tasks : Task x (List ())
tasks =
    Task.parallel
        [ Process.sleep (2 * Time.second) |> Task.map (Debug.log "done")
        , Process.sleep (2 * Time.second) |> Task.map (Debug.log "done")
        , Process.sleep (2 * Time.second) |> Task.map (Debug.log "done")
        , Process.sleep (2 * Time.second) |> Task.map (Debug.log "done")
        ]


type Msg
    = Ran (List ())


type Model
    = Waiting
    | Done


init : ( Model, Cmd Msg )
init =
    ( Waiting, Task.perform Ran tasks )


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
