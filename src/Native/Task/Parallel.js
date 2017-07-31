var _user$project$Native_Task_Parallel = (function() {
  var binding = _elm_lang$core$Native_Scheduler.nativeBinding;
  var andThen = _elm_lang$core$Native_Scheduler.andThen;
  var succeed = _elm_lang$core$Native_Scheduler.succeed;
  var rawSpawn = _elm_lang$core$Native_Scheduler.rawSpawn;

  var parallel = function(tasks) {
    return binding(function(callback) {
      var cnt = 0;
      var results = [];

      while (tasks.ctor !== "[]") {
        cnt += 1;
        var task = tasks._0;
        tasks = tasks._1;

        var wrapped = A2(
          andThen,
          function(r) {
            results.push(r);

            if (results.length == cnt) {
              callback(succeed(results));
            }
          },
          task
        );

        rawSpawn(wrapped);
      }

      return;
    });
  };

  return { parallel: parallel };
})();
