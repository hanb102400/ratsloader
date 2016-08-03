var gulp = require('gulp');
//copy
gulp.task('copy', function() {
  // 将你的默认的任务代码放在这
  gulp.src('src/**') 
  		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['copy']);