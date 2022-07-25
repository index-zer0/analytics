package main

import (
	// Standard library packages
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"strconv"
	"time"

	// Third party packages
	"github.com/julienschmidt/httprouter"
	"github.com/mssola/user_agent"
	"golang.org/x/crypto/argon2"

	// "firebase.google.com/go/auth"
	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

var client *firestore.Client
var salt []byte = []byte("randomdwadawdawdwad1")
var saltUpdateAt time.Time

type Session struct {
	id string

	new_user bool

	size string

	browser         string
	browser_version string
	os              string

	city    string
	region  string
	country string

	referrer string

	pages_visited []string
	// duration?
}

func generateSalt(n uint32) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}

	return b
}

func generateSessionId(hostname string, ip string, ua string) []byte {
	/*if saltUpdateAt.Day() != time.Now().Day() {
		salt = generateSalt(16)
		saltUpdateAt = time.Now()
	}*/

	return argon2.IDKey([]byte(hostname+ip+ua), salt, 3, 1024*64, 2, 32)
}

func analyticsScript(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	contents, _ := ioutil.ReadFile("index.js")
	fmt.Fprintf(w, string(contents))
}

func webpageAnalytics(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	y, m, d := time.Now().Date()
	doc, err := client.
		Collection("years").Doc(strconv.Itoa(y)).
		Collection("months").Doc(strconv.Itoa(int(m))).
		Collection("dates").Doc(strconv.Itoa(d)).
		Get(context.Background())
	if err != nil {
		panic(err)
	}

	data := doc.Data()
	data["bounce_rate"] = float32(data["bounced"].(int64)) / float32(data["unique_visitors"].(int64))

	p, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	fmt.Fprintf(w, string(p))
}

func analytics(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}
	var t map[string]interface{}
	json.Unmarshal(body, &t)

	ip, _, _ := net.SplitHostPort(req.RemoteAddr)

	userAgent := req.UserAgent()
	ua := user_agent.New(userAgent)

	resp, err := http.Get("https://ipinfo.io/" + ip)
	if err != nil {
		panic(err)
	}
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	var geo map[string]interface{}
	json.Unmarshal(body, &geo)

	name, version := ua.Browser()

	sid := generateSessionId(t["h"].(string), ip, userAgent)

	iter := client.Collection("sessions").Where("id", "==", sid).Documents(context.Background())
	doc, err := iter.Next()
	if err == iterator.Done {
		if t["r"] == nil {
			t["r"] = "none"
		}
		if geo["city"] == nil {
			geo["city"] = "none"
		}
		if geo["region"] == nil {
			geo["region"] = "none"
		}
		if geo["country"] == nil {
			geo["country"] = "none"
		}
		pages_visited := [1]string{t["p"].(string)}
		docs := map[string]interface{}{
			"id":              sid,
			"size":            t["w"],
			"browser":         name,
			"browser_version": version,
			"os":              ua.OS(),
			"city":            geo["city"],
			"region":          geo["region"],
			"country":         geo["country"],
			"referrer":        t["r"],
			"pages_visited":   pages_visited,
			"entry_page":      t["p"],
			"exit_page":       t["p"],
			"updated_at":      firestore.ServerTimestamp,
			"created_at":      firestore.ServerTimestamp,
		}
		_, _, err := client.Collection("sessions").Add(context.Background(), docs)
		if err != nil {
			panic(err)
		}
		sizes := map[string]interface{}{}
		if t["w"].(float64) >= 1440 {
			sizes["desktop"] = firestore.Increment(1)
		} else if t["w"].(float64) < 1440 && t["w"].(float64) >= 992 {
			sizes["laptop"] = firestore.Increment(1)
		} else if t["w"].(float64) < 992 && t["w"].(float64) >= 576 {
			sizes["tablet"] = firestore.Increment(1)
		} else {
			sizes["mobile"] = firestore.Increment(1)
		}
		docs = map[string]interface{}{
			"unique_visitors": firestore.Increment(1),
			"page_views":      firestore.Increment(1),
			"bounced":         firestore.Increment(1),
			"top_sources": map[string]interface{}{
				t["r"].(string): firestore.Increment(1),
			},
			"top_pages": map[string]interface{}{
				t["p"].(string): firestore.Increment(1),
			},
			"top_browsers": map[string]interface{}{
				name: firestore.Increment(1),
			},

			"top_oss": map[string]interface{}{
				ua.OS(): firestore.Increment(1),
			},

			"top_countries": map[string]interface{}{
				geo["country"].(string): firestore.Increment(1),
			},

			"top_regions": map[string]interface{}{
				geo["region"].(string): firestore.Increment(1),
			},

			"top_cities": map[string]interface{}{
				geo["city"].(string): firestore.Increment(1),
			},

			"entry_pages": map[string]interface{}{
				t["p"].(string): firestore.Increment(1),
			},

			"exit_pages": map[string]interface{}{
				t["p"].(string): firestore.Increment(1),
			},
			"sizes":      sizes,
			"updated_at": firestore.ServerTimestamp,
			"created_at": firestore.ServerTimestamp,
		}
		y, m, d := time.Now().Date()
		_, err = client.
			Collection("years").Doc(strconv.Itoa(y)).
			Collection("months").Doc(strconv.Itoa(int(m))).
			Collection("dates").Doc(strconv.Itoa(d)).
			Set(context.Background(), docs,
				firestore.MergeAll)

		if err != nil {
			panic(err)
		}
	} else if err == nil {
		pages_visited := append([]interface{}{t["p"]}, doc.Data()["pages_visited"].([]interface{})...)
		_, err = client.Collection("sessions").Doc(doc.Ref.ID).Set(context.Background(),
			map[string]interface{}{
				"pages_visited": pages_visited,
				"exit_page":     t["p"],
				"updated_at":    firestore.ServerTimestamp,
			},
			firestore.MergeAll)
		if err != nil {
			panic(err)
		}
		docs := map[string]interface{}{
			"page_views": firestore.Increment(1),
			"top_pages": map[string]interface{}{
				t["p"].(string): firestore.Increment(1),
			},
			"exit_pages": map[string]interface{}{
				doc.Data()["exit_page"].(string): firestore.Increment(-1),
				t["p"].(string):                  firestore.Increment(1),
			},
			"updated_at": firestore.ServerTimestamp,
		}
		if len(pages_visited) == 2 {
			docs["bounced"] = firestore.Increment(-1)
		}
		y, m, d := time.Now().Date()
		_, err = client.
			Collection("years").Doc(strconv.Itoa(y)).
			Collection("months").Doc(strconv.Itoa(int(m))).
			Collection("dates").Doc(strconv.Itoa(d)).
			Set(context.Background(), docs,
				firestore.MergeAll)

		if err != nil {
			panic(err)
		}
	} else {
		panic(err)
	}
}

func main() {
	opt := option.WithCredentialsFile("./firebaseConfig.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		fmt.Errorf("error initializing app: %v", err)
	}
	/*
		client, err := app.Auth(context.Background())
		if err != nil {
			log.Fatalf("error getting Auth client: %v\n", err)
		}

		claims := map[string]interface{}{
			"premiumAccount": true,
		}

		token, err := client.CustomTokenWithClaims(context.Background(), "some-uid", claims)
		if err != nil {
			log.Fatalf("error minting custom token: %v\n", err)
		}

		log.Printf("Got custom token: %v\n", token)
	*/
	client, err = app.Firestore(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	myport := strconv.Itoa(8080)

	r := httprouter.New()

	r.GET("/", analyticsScript)
	r.POST("/", analytics)

	r.GET("/site/:webpage", webpageAnalytics)

	l, err := net.Listen("tcp", "0.0.0.0:"+myport)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Server started at port:" + myport)

	log.Fatal(http.Serve(l, r))
}
