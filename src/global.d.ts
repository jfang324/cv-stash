declare global {
    var db: {
        connection: mongoose.Connection
    } | null
    var s3: {
        client: S3Client
    } | null
}

export {}
