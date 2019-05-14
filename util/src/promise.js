/**
 * 异步任务的串行队列执行能力
 * 注意：new Promise会默认执行参数函数体
 * 注意：因此task是一个返回Promise对象的函数数组，而不是Promise对象数组
 *
 * 调用方法：在Promise对象前添加 'serial =>' 将对象转化为任务函数，填入任务队列
 */
Promise.serial = function (tasks) {
  return tasks.reduce((promiseChain, currentTask) =>
    promiseChain.then(chainResults =>
      // 任务若为函数，则先拿到函数内的Promise对象
      (Object.prototype.toString.call(currentTask).indexOf('Function') > 0 ? currentTask() : currentTask)
        .then(currentResult => [...chainResults, currentResult])
    ), Promise.resolve([]))
};

/**
 * 异步任务的并发执行能力
 * 注意：为了与串行接口用法保持一致，包装一层Promise.call调用
 * 注意：将task包装成返回Promise对象的函数数组，而不是Promise对象数组
 *
 * 调用方法：在Promise对象前添加 'parallel =>' 将对象转化为任务函数，填入任务队列
 *
 * 警告：目前该方法存在异常，不能使用
 */
Promise.parallel = function (tasks) {
  tasks.forEach( (t, i) =>
    tasks[i] = Object.prototype.toString.call(t).indexOf('Function') > 0 ? t() : t
  );
  return Promise.all(tasks)
};

// 并发执行缩略语
Promise.paral = Promise.parallel;
