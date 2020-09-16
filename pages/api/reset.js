import { reset } from "../../lib/fs-cms";

export default async function apiReset(req, res) {
    if (!process.env.IS_TEST_MODE) {
        res.status(400)
        return res.end('Endpoint /api/reset is only available in the test mode.')
    }

    if (req.method !== 'POST') {
        res.status(400)
        return res.end('Endpoint /api/reset only accept POST requests.')
    }

    await reset()
    return res.send({ success: true });
}