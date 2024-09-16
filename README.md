# Python sürümünü kontrol edin:
$  python -V
Python 3.11.2

# Projeyi şu isimli klasörde toplayacağız ch-python:
$ mkdir ch-python
$ cd ch-python

# Şu isimle bir bağımlılık dosyası oluşturun requirements.txt:
clickhouse-connect==0.5.23

# Şu isimde bir python kaynak dosyası oluşturun main.py:
import clickhouse_connect
import sys
import json

CLICKHOUSE_CLOUD_HOSTNAME = 'HOSTNAME.clickhouse.cloud'
CLICKHOUSE_CLOUD_USER = 'default'
CLICKHOUSE_CLOUD_PASSWORD = 'YOUR_SECRET_PASSWORD'

client = clickhouse_connect.get_client(
    host=CLICKHOUSE_CLOUD_HOSTNAME, port=8443, username=CLICKHOUSE_CLOUD_USER, password=CLICKHOUSE_CLOUD_PASSWORD)

print("connected to " + CLICKHOUSE_CLOUD_HOSTNAME + "\n")
client.command(
    'CREATE TABLE IF NOT EXISTS new_table (key UInt32, value String, metric Float64) ENGINE MergeTree ORDER BY key')

print("table new_table created or exists already!\n")

row1 = [1000, 'String Value 1000', 5.233]
row2 = [2000, 'String Value 2000', -107.04]
data = [row1, row2]
client.insert('new_table', data, column_names=['key', 'value', 'metric'])

print("written 2 rows to table new_table\n")

QUERY = "SELECT max(key), avg(metric) FROM new_table"

result = client.query(QUERY)

sys.stdout.write("query: ["+QUERY + "] returns:\n\n")
print(result.result_rows)

# Sanal ortamı yaratın:
chpython$ python -m venv venv

# Sanal ortamı yükleyin:
chpython$ source venv/bin/activate

# Yüklendikten sonra terminal isteminize (venv) eklenmeli ve bağımlılıklar yüklenmelidir:

(venv) ➜  chpython$ pip install -r requirements.txt
Collecting certifi
  Using cached certifi-2023.5.7-py3-none-any.whl (156 kB)
Collecting urllib3>=1.26
  Using cached urllib3-2.0.2-py3-none-any.whl (123 kB)
Collecting pytz
  Using cached pytz-2023.3-py2.py3-none-any.whl (502 kB)
Collecting zstandard
  Using cached zstandard-0.21.0-cp311-cp311-macosx_11_0_arm64.whl (364 kB)
Collecting lz4
  Using cached lz4-4.3.2-cp311-cp311-macosx_11_0_arm64.whl (212 kB)
Installing collected packages: pytz, zstandard, urllib3, lz4, certifi, clickhouse-connect
Successfully installed certifi-2024.5.7 clickhouse-connect-0.5.23 lz4-4.3.2 pytz-2024.3 urllib3-2.0.2 zstandard-0.21.0

# Kodu başlatın!
(venv) chpython$ venv/bin/python main.py

connected to HOSTNAME.clickhouse.cloud

table new_table created or exists already!

written 2 rows to table new_table

query: [SELECT max(key), avg(metric) FROM new_table] returns:

[(2000, -50.9035)]

# Dilediğiniz yerde bir dizin oluşturun:
mkdir test
➜  test pwd
/Users/jaijhala/Desktop/terraform/test

# dosya oluşturun: main.tfvesecret.tfvarsAşağıdakileri kopyalayın:main.tfdosya şöyle olurdu:
terraform {
 required_providers {
   clickhouse = {
     source = "ClickHouse/clickhouse"
     version = "0.0.2"
   }
 }
}

variable "organization_id" {
  type = string
}

variable "token_key" {
  type = string
}

variable "token_secret" {
  type = string
}

provider clickhouse {
  environment   = "production"
  organization_id = var.organization_id
  token_key     = var.token_key
  token_secret  = var.token_secret
}


variable "service_password" {
  type = string
  sensitive   = true
}

resource "clickhouse_service" "service123" {
  name          = "jai-terraform"
  cloud_provider = "aws"
  region        = "us-east-2"
  tier          = "development"
  idle_scaling   = true
  password  = var.service_password
  ip_access = [
    {
        source      = "0.0.0.0/0"
        description = "Anywhere"
    }
  ]
}

output "CLICKHOUSE_HOST" {
  value = clickhouse_service.service123.endpoints.0.host
}

Yukarıdaki kaynaklar bölümünden servis adı, bölge vb. gibi kendi parametrelerinizi değiştirebilirsiniz.

secret.tfvarsdaha önce indirdiğiniz tüm API Anahtarı ile ilgili bilgileri koyacağınız yerdir. Bu dosyanın arkasındaki fikir, tüm gizli kimlik bilgilerinizin ana yapılandırma dosyasından gizlenecek olmasıdır.

(Bu parametreleri değiştirin) şöyle bir şey olurdu:Yukarıdaki kaynaklar bölümünden servis adı, bölge vb. gibi kendi parametrelerinizi değiştirebilirsiniz.

secret.tfvarsdaha önce indirdiğiniz tüm API Anahtarı ile ilgili bilgileri koyacağınız yerdir. Bu dosyanın arkasındaki fikir, tüm gizli kimlik bilgilerinizin ana yapılandırma dosyasından gizlenecek olmasıdır.

(Bu parametreleri değiştirin) şöyle bir şey olurdu:

`organization_id = "e957a5f7-4qe3-4b05-ad5a-d02b2dcd0593"
token_key = "QWhhkMeytqQruTeKg"
token_secret = "4b1dNmjWdLUno9lXxmKvSUcPP62jvn7irkuZPbY"
service_password = "password123!"`

# terraform initBu dizinden çalıştırın,Beklenen çıktı:
```
Initializing the backend...
Initializing provider plugins...
- Finding clickhouse/clickhouse versions matching "0.0.2"...
- Installing clickhouse/clickhouse v0.0.2...
- Installed clickhouse/clickhouse v0.0.2 (self-signed, key ID D7089EE5C6A92ED1)

Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://www.terraform.io/docs/cli/plugins/signing.html

Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.

```

# terraform apply -var-file=secret.tfvarsKomutu
```
➜  test terraform apply -var-file=secret.tfvars

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with
the following symbols:
  + create

Terraform will perform the following actions:

  # clickhouse_service.service123 will be created
  + resource "clickhouse_service" "service123" {
      + cloud_provider = "aws"
      + endpoints      = (known after apply)
      + id             = (known after apply)
      + idle_scaling   = true
      + ip_access      = [
          + {
              + description = "Anywhere"
              + source      = "0.0.0.0/0"
            },
        ]
      + last_updated   = (known after apply)
      + name           = "jai-terraform"
      + password       = (sensitive value)
      + region         = "us-east-2"
      + tier           = "development"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + CLICKHOUSE_HOST = (known after apply)

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes
  ```

## Yazın yesve enter'a basın

Yan not: Yukarıda yazdığına dikkat edin password = (sensitive value). Bunun sebebi, sensitive = trueşifreyi main.tf dosyasında ayarlamamızdır.

7). Hizmeti oluşturmak birkaç dakika sürecektir ancak sonunda aşağıdaki gibi bir sonuç elde edilecektir:

```
  Enter a value: yes

clickhouse_service.service123: Creating...
clickhouse_service.service123: Still creating... [10s elapsed]
clickhouse_service.service123: Still creating... [20s elapsed]
clickhouse_service.service123: Still creating... [30s elapsed]
clickhouse_service.service123: Still creating... [40s elapsed]
clickhouse_service.service123: Still creating... [50s elapsed]
clickhouse_service.service123: Still creating... [1m0s elapsed]
clickhouse_service.service123: Still creating... [1m10s elapsed]
clickhouse_service.service123: Still creating... [1m20s elapsed]
clickhouse_service.service123: Still creating... [1m30s elapsed]
clickhouse_service.service123: Still creating... [1m40s elapsed]
clickhouse_service.service123: Creation complete after 1m41s [id=aa8d8d63-1878-4600-8470-630715af38ed]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

CLICKHOUSE_HOST = "h3ljlaqez6.us-east-2.aws.clickhouse.cloud"
➜  test
```

### Cloud Console'u kontrol edin, oluşturulan hizmeti görebilmelisiniz.

9). Hizmeti tekrar temizlemek/yok etmek için şunu çalıştırın:terraform destroy -var-file=secret.tfvars

```
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with
the following symbols:
  - destroy

Terraform will perform the following actions:

  # clickhouse_service.service123 will be destroyed
  - resource "clickhouse_service" "service123" {
      - cloud_provider = "aws" -> null
      - ............

Plan: 0 to add, 0 to change, 1 to destroy.

Changes to Outputs:
  - CLICKHOUSE_HOST = "h3ljlaqez6.us-east-2.aws.clickhouse.cloud" -> null

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value:
```

## Evet yazın ve enter'a basın

```
clickhouse_service.service123: Destroying... [id=aa8d8d63-1878-4600-8470-630715af38ed]
clickhouse_service.service123: Still destroying... [id=aa8d8d63-1878-4600-8470-630715af38ed, 10s elapsed]
clickhouse_service.service123: Still destroying... [id=aa8d8d63-1878-4600-8470-630715af38ed, 20s elapsed]
clickhouse_service.service123: Destruction complete after 27s

Destroy complete! Resources: 1 destroyed.
```
