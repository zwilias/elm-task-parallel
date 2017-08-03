module App exposing (main)

import Html exposing (Html, text)
import Process
import Task exposing (Task)
import Task.Parallel as Task
import Time


tasks : Task String (List String)
tasks =
    Task.parallel
        [ Process.sleep (1.5 * Time.second) |> Task.map (always "first")
        , Process.sleep (1 * Time.second) |> Task.map (always "second")
        , Process.sleep (0.8 * Time.second) |> Task.map (always "third")
        , Process.sleep (1.2 * Time.second) |> Task.map (always "fourth")
        ]


type Msg
    = Ran (Result String (List String))


type Model
    = Waiting
    | Done


init : ( Model, Cmd Msg )
init =
    ( Waiting, Task.attempt Ran tasks )


update : Msg -> Model -> ( Model, Cmd msg )
update msg _ =
    let
        _ =
            Debug.log "msg" msg
    in
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
