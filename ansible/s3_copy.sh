#!/bin/sh
AWS_CONFIG_FILE="~/.aws/config"

aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.assessment-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.assessment-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.assessmentbrowser-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.assetbrowser-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.atpreview-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.colorpicker-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.config-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.copypaste-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.delete-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.hollowcircle-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.hotspot-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.image-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.reorder-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.scribblepad-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.shape-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.stage-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.stagedecorator-1.0/ --recursive
aws s3 rm s3://ekstep-public/dev/content-plugins/org.ekstep.text-1.0/ --recursive

aws s3 cp /var/www/dev.ekstep.in/public/content-plugins/content-plugins s3://ekstep-public/dev/content-plugins/ --recursive --acl public-read
