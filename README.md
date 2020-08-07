# learn-it-api

# git init

# git add -A

# git commit -m 'Added my project'

# git remote add origin https://github.com/devevangel/learn-it-api.git

# git push -u -f origin master

<!-- // needed => { \_id: { $in: ['5f242994f740932678827b11', '5f242994f740932678827b19'] } }
// so far => { _id: { '$in': [ '5f242994f740932678827b11', '5f242994f740932678827b19']} }
exports.getQuestionsByIds = catchAsync(async (req, res) => {
const queryObj = { ...req.query };

let queryStr = JSON.stringify(queryObj);
queryStr = queryStr.replace(/\s+/g, '');
queryStr = queryStr.trim().replace(/\b(in)\b/g, match => `$${match}`);

let builtQuery = JSON.parse(queryStr);

let ids = builtQuery.\_id.\$in;
ids = ids.split(',');

builtQuery.\_id.\$in = ids;

const questions = await Question.find(builtQuery);

res.status(200).json({
status: 'success',
results: questions.length,
data: {
questions
}
});
}); -->
