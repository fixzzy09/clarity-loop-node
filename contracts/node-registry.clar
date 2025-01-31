;; Node Registry Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-already-registered (err u101))

;; Data structures
(define-map nodes
  { node-id: (string-ascii 64) }
  {
    owner: principal,
    metadata: (string-utf8 256),
    status: (string-ascii 20),
    registered-at: uint
  }
)

;; Node registration
(define-public (register-node 
  (node-id (string-ascii 64))
  (metadata (string-utf8 256))
)
  (let ((existing-node (get-node-info node-id)))
    (asserts! (is-none existing-node) err-already-registered)
    (ok (map-set nodes
      { node-id: node-id }
      {
        owner: tx-sender,
        metadata: metadata,
        status: "active",
        registered-at: block-height
      }
    ))
  )
)

;; Update node status
(define-public (update-status
  (node-id (string-ascii 64))
  (new-status (string-ascii 20))
)
  (let ((node (unwrap! (get-node-info node-id) err-not-authorized)))
    (asserts! (is-eq (get owner node) tx-sender) err-not-authorized)
    (ok (map-set nodes
      { node-id: node-id }
      (merge node { status: new-status })
    ))
  )
)

;; Read only functions
(define-read-only (get-node-info (node-id (string-ascii 64)))
  (map-get? nodes { node-id: node-id })
)
