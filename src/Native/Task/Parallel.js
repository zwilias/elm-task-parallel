var _user$project$Native_Task_Parallel = (function() {
    var Err = 'Err';
    var Ok = 'Ok';

    var Scheduler = _elm_lang$core$Native_Scheduler;
    var Utils = _elm_lang$core$Native_Utils;
    var List = _elm_lang$core$Native_List;

    var makeProcess = function(receiver) {
        return {
            ctor: '_Process',
            id: Utils.guid(),
            root: receiver,
            stack: null,
            mailbox: []
        };
    };

    var makeReceiver = function(taskCount, callback) {
        var results = [];
        var received = 0;

        var receiver = Scheduler.receive(function(result) {
            results[result.idx] = result.val;

            if (result.status === Err) {
                callback(Scheduler.fail(result.val));
                return Scheduler.fail(Utils.tuple0);
            }

            if (++received === taskCount) {
                callback(Scheduler.succeed(List.fromArray(results)));
                return Scheduler.succeed(Utils.tuple0);
            }

            return receiver;
        });

        return receiver;
    };

    var wrapper = function(f, status) {
        return { f: f, status: status };
    };

    var wrapHelper = function(wrapper, idx, process, task) {
        return A2(
            wrapper.f,
            function(result) {
                return A2(Scheduler.send, process, {
                    idx: idx,
                    status: wrapper.status,
                    val: result
                });
            },
            task
        );
    };

    var wrap = function(idx, process, task) {
        [
            wrapper(Scheduler.onError, Err),
            wrapper(Scheduler.andThen, Ok)
        ].forEach(function(wrapper) {
            task = wrapHelper(wrapper, idx, process, task);
        });

        return task;
    };

    var parallel = function(tasks_) {
        return Scheduler.nativeBinding(function(callback) {
            var tasks = List.toArray(tasks_);
            var receiver = makeReceiver(tasks.length, callback);
            var process = makeProcess(receiver);

            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];

                Scheduler.rawSpawn(wrap(i, process, task));
            }
        });
    };

    return { parallel: parallel };
})();
