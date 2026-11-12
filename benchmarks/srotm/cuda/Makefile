CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/srotm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/srotm: srotm.c $(HDRS) | $(BIN)
	$(CC) srotm.c -o $(BIN)/srotm -lcublas

clean:
	rm -rf $(BIN)
