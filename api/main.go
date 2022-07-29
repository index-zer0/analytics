package main

import (
	// Standard library packages
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"reflect"
	"strconv"
	"time"

	// Third party packages
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/mssola/user_agent"
	"golang.org/x/crypto/argon2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	// "firebase.google.com/go/auth"
	"cloud.google.com/go/firestore"
	_ "firebase.google.com/go/v4"
	"google.golang.org/api/iterator"
	_ "google.golang.org/api/option"
)

var client *firestore.Client
var db *gorm.DB
var salt []byte = []byte("randomdwadawdawdwad3")
var saltUpdateAt time.Time

type Session struct {
	// duration?
	gorm.Model
	Id             string
	Size           int
	Browser        string
	BrowserVersion string
	Os             string
	City           string
	Region         string
	Country        string
	Referrer       string
	PagesVisited   string
	EntryPage      string
	ExitPage       string
	UpdatedAt      time.Time
	CreatedAt      time.Time
}

type TopCount struct {
	Name  string
	Count int
}

type WindowSizes struct {
	Desktop uint32 `json:"desktop"`
	Laptop  uint32 `json:"laptop"`
	Tablet  uint32 `json:"tablet"`
	Mobile  uint32 `json:"mobile"`
}

type Payload struct {
	UniqueVisitors uint32  `json:"unique_visitors"`
	PageViews      uint32  `json:"page_views"`
	BounceRate     float32 `json:"bounce_rate"`

	Sizes         WindowSizes    `json:"sizes"`
	TopBrowsers   map[string]int `json:"top_browsers"`
	TopOss        map[string]int `json:"top_oss"`
	TopCities     map[string]int `json:"top_cities"`
	TopRegions    map[string]int `json:"top_regions"`
	TopCountries  map[string]int `json:"top_countries"`
	TopEntryPages map[string]int `json:"entry_pages"`
	TopExitPages  map[string]int `json:"exit_pages"`
	// Referrer     map[string]int
}

func generateSalt(n uint32) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}

	return b
}

func MergeMaps(maps []map[string]interface{}) (result map[string]interface{}) {
	result = make(map[string]interface{})
	for _, m := range maps {
		for k, v := range m {
			if _, p := result[k]; p {
				if reflect.ValueOf(result[k]).Kind() == reflect.Map {
					result[k] = MergeMaps([]map[string]interface{}{result[k].(map[string]interface{}), v.(map[string]interface{})})
				} else if reflect.ValueOf(result[k]).Kind() == reflect.Int64 {
					result[k] = result[k].(int64) + v.(int64)
				} else {
					continue
				}
			} else {
				result[k] = v
			}
		}
	}
	return result
}

func generateSessionId(hostname string, ip string, ua string) string {
	/*if saltUpdateAt.Day() != time.Now().Day() {
		salt = generateSalt(16)
		saltUpdateAt = time.Now()
	}*/

	hash := argon2.IDKey([]byte(hostname+ip+ua), salt, 3, 1024*64, 2, 32)
	return base64.RawStdEncoding.EncodeToString(hash)
}

func analyticsScript(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	contents, _ := ioutil.ReadFile("index.js")
	fmt.Fprintf(w, string(contents))
}

func AllTime() string {
	var payload Payload
	var top_browsers []TopCount
	payload.TopBrowsers = make(map[string]int)
	db.Raw("SELECT browser as Name, COUNT(DISTINCT browser) as Count FROM sessions GROUP BY browser").Scan(&top_browsers)
	for _, browser := range top_browsers {
		payload.TopBrowsers[browser.Name] = browser.Count
	}

	var top_oss []TopCount
	payload.TopOss = make(map[string]int)
	db.Raw("SELECT os as Name, COUNT(DISTINCT os) as Count FROM sessions GROUP BY os").Scan(&top_oss)
	for _, os := range top_oss {
		payload.TopOss[os.Name] = os.Count
	}

	var top_cities []TopCount
	payload.TopCities = make(map[string]int)
	db.Raw("SELECT city as Name, COUNT(DISTINCT city) as Count FROM sessions GROUP BY city").Scan(&top_cities)
	for _, city := range top_cities {
		payload.TopCities[city.Name] = city.Count
	}

	var top_regions []TopCount
	payload.TopRegions = make(map[string]int)
	db.Raw("SELECT region as Name, COUNT(DISTINCT region) as Count FROM sessions GROUP BY region").Scan(&top_regions)
	for _, region := range top_regions {
		payload.TopRegions[region.Name] = region.Count
	}

	var top_countries []TopCount
	payload.TopCountries = make(map[string]int)
	db.Raw("SELECT country as Name, COUNT(DISTINCT country) as Count FROM sessions GROUP BY country").Scan(&top_countries)
	for _, country := range top_countries {
		payload.TopCountries[country.Name] = country.Count
	}

	var top_entry_pages []TopCount
	payload.TopEntryPages = make(map[string]int)
	db.Raw("SELECT entry_page as Name, COUNT(DISTINCT entry_page) as Count FROM sessions GROUP BY entry_page").Scan(&top_entry_pages)
	for _, page := range top_entry_pages {
		payload.TopEntryPages[page.Name] = page.Count
	}

	var top_exit_pages []TopCount
	payload.TopExitPages = make(map[string]int)
	db.Raw("SELECT exit_page as Name, COUNT(DISTINCT exit_page) as Count FROM sessions GROUP BY exit_page").Scan(&top_exit_pages)
	for _, page := range top_exit_pages {
		payload.TopExitPages[page.Name] = page.Count
	}
	/*db.Where("created_at <= ?", time.Now()).Find(&sessions)
	s, err := json.Marshal(sessions)
	if err != nil {
		panic(err)
	}
	var se []map[string]interface{}
	json.Unmarshal(s, &se)
	result := MergeMaps(se)
	*/
	p, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}
	return string(p)
	/*
		y, m, d := time.Now().Date()
		date := strconv.Itoa(y) + "-"
		if int(m) < 10 {
			date = date + "0" + strconv.Itoa(int(m)) + "-"
		} else {
			date = date + strconv.Itoa(int(m)) + "-"
		}
		if d < 10 {
			date = date + "0" + strconv.Itoa(d)
		} else {
			date = date + strconv.Itoa(d)
		}
		date = strconv.Itoa(y) + "-" + strconv.Itoa(int(m)) + "-" + strconv.Itoa(d)

		iter := client.
			Collection("data").
			Where("date", "<=", date).
			Documents(context.Background())

		var docs [](map[string]interface{})
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				panic(err)
			}
			docs = append(docs, doc.Data())
		}
		data := MergeMaps(docs)

		data["bounce_rate"] = float32(data["bounced"].(int64)) / float32(data["unique_visitors"].(int64))

		p, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}
		return string(p)
	*/
}

func GetMonth(m string, y string) string {
	date := y + "-" + m + "-"

	dsnap, err := client.Collection("months").
		Doc(y + "-" + m).Get(context.Background())

	if err != nil || dsnap == nil {
		iter := client.
			Collection("data").
			Where("date", "<=", date+"31").
			Where("date", ">=", date+"1").
			Documents(context.Background())

		var docs [](map[string]interface{})
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				panic(err)
			}
			docs = append(docs, doc.Data())
		}
		data := MergeMaps(docs)

		if data["bounced"] != nil && data["unique_visitors"] != nil {
			data["bounce_rate"] = float32(data["bounced"].(int64)) / float32(data["unique_visitors"].(int64))
		}
		_, err = client.Collection("months").Doc(y+"-"+m).Set(context.Background(), data)
		if err != nil {
			panic(err)
		}
		p, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}
		return string(p)
	} else {
		data := dsnap.Data()
		p, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}
		return string(p)
	}
}

func webpageAnalytics(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	r := req.URL.Query()
	query_type := r.Get("type")

	switch query_type {
	case "month":
		y, m, _ := time.Now().Date()
		if _, err := strconv.Atoi(r.Get("m")); err == nil {
			if _, err := strconv.Atoi(r.Get("y")); err == nil {
				fmt.Fprintf(w, GetMonth(r.Get("m"), r.Get("y")))
			} else {
				fmt.Fprintf(w, GetMonth(r.Get("m"), strconv.Itoa(y)))
			}
		} else {
			fmt.Fprintf(w, GetMonth(strconv.Itoa(int(m)), strconv.Itoa(y)))
		}
	default:
		fmt.Fprintf(w, AllTime())
	}
}

func str(s interface{}) string {
	if s == nil {
		return ""
	}
	return s.(string)
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

	var session Session
	result := db.Take(&session, "id = ?", sid)

	if result.RowsAffected == 0 {
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
		// pages_visited := [1]string{t["p"].(string)}
		db.Create(&Session{
			Id:             sid,
			Size:           int(t["w"].(float64)),
			Browser:        name,
			BrowserVersion: version,
			Os:             ua.OS(),
			City:           str(geo["city"]),
			Region:         str(geo["region"]),
			Country:        str(geo["country"]),
			Referrer:       str(t["r"]),
			PagesVisited:   "pages_visited",
			EntryPage:      str(t["p"]),
			ExitPage:       str(t["p"]),
			UpdatedAt:      time.Now(),
			CreatedAt:      time.Now(),
		})

	} else if result.RowsAffected > 0 {
		// pages_visited := append([]interface{}{t["p"]}, doc.Data()["pages_visited"].([]interface{})...)
		session.PagesVisited = "pages_visited"
		session.ExitPage = str(t["p"])
		db.Save(&session)

	}
}

func GetDatabase() (*sql.DB, error) {
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	return db, err
}

func main() {
	err := godotenv.Load()

	db, err = gorm.Open(mysql.Open(os.Getenv("DSN")), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		panic(err)
	}

	// db.AutoMigrate(&Session{})
	// db.Migrator().DropTable(&Session{})

	myport := strconv.Itoa(8080)

	r := httprouter.New()

	r.GET("/", analyticsScript)
	r.POST("/", analytics)

	r.GET("/site/:webpage", webpageAnalytics)

	l, err := net.Listen("tcp", "0.0.0.0:"+myport)
	if err != nil {
		panic(err)
	}
	fmt.Println("Server started at port:" + myport)

	panic(http.Serve(l, r))
}
