import Vue from "vue";
import dayjs from "dayjs";

Vue.prototype.$formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD')
}