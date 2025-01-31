;; Node Data Contract

;; Constants
(define-constant err-not-registered (err u102))

;; Data structures
(define-map node-data-entries
  { node-id: (string-ascii 64), timestamp: uint }
  { data: (string-utf8 1024) }
)

;; Submit node data
(define-public (submit-data
  (node-id (string-ascii 64))
  (data (string-utf8 1024))
)
  (let ((node (contract-call? .node-registry get-node-info node-id)))
    (asserts! (is-some node) err-not-registered)
    (ok (map-set node-data-entries
      { node-id: node-id, timestamp: block-height }
      { data: data }
    ))
  )
)

;; Get data history
(define-read-only (get-data-entry
  (node-id (string-ascii 64))
  (timestamp uint)
)
  (map-get? node-data-entries { node-id: node-id, timestamp: timestamp })
)
