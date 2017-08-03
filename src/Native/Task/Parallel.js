var _user$project$Native_Task_Parallel = (function() {
  var binding = _elm_lang$core$Native_Scheduler.nativeBinding;
  var andThen = _elm_lang$core$Native_Scheduler.andThen;
  var onError = _elm_lang$core$Native_Scheduler.onError;
  var succeed = _elm_lang$core$Native_Scheduler.succeed;
  var rawSpawn = _elm_lang$core$Native_Scheduler.rawSpawn;
  var send = _elm_lang$core$Native_Scheduler.send;
  var receive = _elm_lang$core$Native_Scheduler.receive;
  var tuple0 = _elm_lang$core$Native_Utils.Tuple0;

  var parallel = function(tasks) {
    return binding(function(callback) {
      var results = [];
      var received = 0;
      var taskCount = 0;

      var receiver = receive(function(result) {
        console.log(result);
        received += 1;
        results[result.idx] = result.val;

        console.log(received, taskCount);
        if (received === taskCount) {
          callback(succeed(results));
          return succeed(tuple0);
        }

        return receiver;
      });

      var process = {
        ctor: "_Process",
        id: _elm_lang$core$Native_Utils.guid(),
        root: receiver,
        stack: null,
        mailbox: []
      };

      while (tasks.ctor !== "[]") {
        var task = tasks._0;
        tasks = tasks._1;

        var sender = (function(idx) {
          return A2(
            onError,
            function(err) {
              return A2(send, process, { idx: idx, status: "Err", val: err });
            },
            A2(
              andThen,
              function(result) {
                return A2(send, process, {
                  idx: idx,
                  status: "Ok",
                  val: result
                });
              },
              task
            )
          );
        })(taskCount);

        rawSpawn(sender);
        taskCount++;
      }
    });
  };

  return { parallel: parallel };
})();
