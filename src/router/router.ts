import {createRouter, createWebHashHistory} from "vue-router";
import routes from './routes'

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        // always scroll to 0
        window.scrollTo(0, 0)
    },
})

export default router