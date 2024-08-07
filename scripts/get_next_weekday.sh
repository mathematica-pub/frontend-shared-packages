get_next_weekday() {
    date=$(date +%m/%d/%Y)
    while true; do
        date=$(date -d "$date + 1 day" +%m/%d/%Y)
        day_of_week=$(date -d "$date" +%u)
        if [ "$day_of_week" -lt 6 ]; then
            echo "$date"
            break
        fi
    done
}
next_weekday=$(get_next_weekday)
echo "next_weekday=$next_weekday" >> $GITHUB_ENV
