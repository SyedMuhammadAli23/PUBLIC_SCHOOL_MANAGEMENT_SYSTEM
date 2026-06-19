package middleware

import (
	"context"
	"net/http"
)

type contextKey string

const (
	UserIDKey    contextKey = "user_id"
	UserRoleKey  contextKey = "user_role"
	UserEmailKey contextKey = "user_email"
	UserNameKey  contextKey = "user_name"
)

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		if uid := r.Header.Get("X-User-Id"); uid != "" {
			ctx = context.WithValue(ctx, UserIDKey, uid)
		}
		if urole := r.Header.Get("X-User-Role"); urole != "" {
			ctx = context.WithValue(ctx, UserRoleKey, urole)
		}
		if uemail := r.Header.Get("X-User-Email"); uemail != "" {
			ctx = context.WithValue(ctx, UserEmailKey, uemail)
		}
		if uname := r.Header.Get("X-User-Name"); uname != "" {
			ctx = context.WithValue(ctx, UserNameKey, uname)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
