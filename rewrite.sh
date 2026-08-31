git filter-branch -f --env-filter '
  if [ "" = "AI Bot" ]; then
    export GIT_AUTHOR_NAME="redrighthand2007"
    export GIT_AUTHOR_EMAIL="redrighthand2007@gmail.com"
    export GIT_COMMITTER_NAME="redrighthand2007"
    export GIT_COMMITTER_EMAIL="redrighthand2007@gmail.com"
  fi
' --msg-filter '
  read -d "" msg;
  # extract just the text after the colon if it exists, or just the text
  clean_msg=(echo "msg" | sed -E "s/^[a-z]+\([^)]+\): //g" | sed -E "s/^[a-z]+: //g")
  # take first 3 words
  short_msg=(echo "clean_msg" | awk "{print \1,\2,\3}")
  echo "short_msg"
' HEAD
